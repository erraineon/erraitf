+++
title = "Reversing Super Fighter M"
date = 2024-02-16
description = "Delightful little tricks"
+++
{% topic(title="Objective") %}
Super Fighter M was a bootleg mobile gacha game using blatantly ripped assets from Nintendo games. It was shut down sometime in the early 2020s, and was known for its memorably absurd, often out of character voice lines of the caliber of "Your friend is waiting for you in the garage" or "I have something important to tell you in advance."

{{figure(title="Evil Mario", filename="devil.png", caption='"Bowser means nothing to me."')}}

After watching [this video](https://www.youtube.com/watch?v=H9S5iVxCdEQ), I wanted to unearth the rest of the voice clips.

I downloaded [the most recent version of the game](https://download.cnet.com/download/super-fighter-m/3000-android-super-fighter-m.html), unzipped the .apk and .obb files, and decompiled the project by loading the `bin` directory into [Asset Ripper](https://github.com/AssetRipper/AssetRipper). No scripts were decompiled, since the game was pre-compiled with IL2CPP. But at least, the assets were visible.

There were 248 .ogg files in the `Assets\defenders\resources\audio\pet` directory, with seemingly random file names. While possible, mapping them manually would've been a chore. Additionally, there was a `2020-10-23_17-33-36_Android.pak` file, weighing over 600MB. A peek with [XVI32](http://www.chmaas.handshake.de/delphi/freeware/xvi32/xvi32.htm) revealed that it contained the game assets. But where and how were they being unpacked?

I downloaded an [old version](https://www.vg-resource.com/thread-39792.html) of the game. Since It doesn't use IL2CPP, the assemblies could be decompiled. Things got interesting.
{% end %}

{% topic(title="Missing link") %}
In the decompiled assemblies, this part of `GTLauncher` stood out:
```
byte[] sourceData = File.ReadAllBytes(
  GTResourceManagerBase.GetExtPath() + "/Geart3D.dll"
);
byte[] rawAssembly = ResEncryptDecrypt.DecryptBinaryFromFileData(
  sourceData
);
```
The called method is:
```
public static byte[] DecryptBinaryFromFileData(byte[] sourceData)
{
  int num = sourceData.Length;
  IntPtr intPtr = Marshal.AllocHGlobal(num);
  Marshal.Copy(sourceData, 0, intPtr, num);
  IntPtr source = _DecryptBinaryFromFileData(intPtr, num);
  byte[] array = new byte[num - 4];
  Marshal.Copy(source, array, 0, num - 4);
  Marshal.FreeHGlobal(intPtr);
  return array;
}
```
Which subsequently calls:
```
[DllImport("sqlite_unity_plugin", CallingConvention = CallingConvention.Cdecl)]
private static extern IntPtr _DecryptBinaryFromFileData(IntPtr sourceData, int sourceSize);
```
Why would a SQLite plugin expose encryption and decryption functions? I found `lib\armeabi-v7a\libsqlite_unity_plugin.so` in the game files. Could the devs had meant to add a layer of misdirection by hiding core logic in an unassuming "third party" library?

Using [Ghidra](https://ghidra-sre.org/), I disassembled the library and found that it indeed did much more than just SQLite queries, including the function in question. The decompiled output was:
```
void _DecryptBinaryFromFileData(int ptr,int len)
{
  undefined auStack_cc [176];
  int local_1c;
  
  local_1c = __stack_chk_guard;
  ExpandKey(&DAT_0008579c,auStack_cc);
  BinaryDecrypt(ptr + 4,len + -4,auStack_cc);
  if (__stack_chk_guard - local_1c != 0) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail(__stack_chk_guard - local_1c);
  }
  return;
}
```
Based off the contents of the `ExpandKey` and `BinaryDecrypt` functions, it became clear that the `Geart3D.dll` file was encrypted with AES, using the key at `&DAT_0008579c`. To decrypt it, I ran:
```
using var aes = Aes.Create();
aes.Key = [0, 1, 2, 4, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0];
aes.Mode = CipherMode.ECB;
aes.Padding = PaddingMode.None;
using var input = new FileStream("Geart3D.dll", FileMode.Open);
// Skip the first four bytes, like _DecryptBinaryFromFileData
input.Seek(4, SeekOrigin.Begin);
using var cryptoStream = new CryptoStream(
    input,
    aes.CreateDecryptor(),
    CryptoStreamMode.Read
);
using var output = new FileStream("output.dll", FileMode.Create);
cryptoStream.CopyTo(output);
```
The decompiled output contained the `PakFileManager` class, which revealed the format of the .pak file. To unpack it, I used:
```
var input = File.Open(
    "2020-10-23_17-33-36_Android.pak",
    FileMode.Open,
    FileAccess.Read
);
var binaryReader = new BinaryReader(input);
binaryReader.ReadInt64(); // Ignore
while (binaryReader.ReadString() is {} fileName && 
       !string.IsNullOrWhiteSpace(fileName))
{
    var fileOffset = binaryReader.ReadInt32();
    var fileLength = binaryReader.ReadInt32();
    if (fileName is not ("Index" or "Manifest"))
    {
        var currentPosition = input.Position;
        input.Position = fileOffset;
        var assetBundleData = new byte[fileLength];
        input.ReadExactly(assetBundleData, 0, fileLength);
        File.WriteAllBytes(fileName, assetBundleData);
        input.Position = currentPosition;
    }
}
binaryReader.Close();
input.Close();
```
I re-ran Asset Ripper, now also accounting for the newly unpacked asset bundles. With decompiled binaries (even though from an older version) and presumably most of the game assets unpacked, I was almost ready to put it all together.
{% end %}

{% topic(title="Showtime") %}
After decompiling the decrypted Geart3D.dll assembly, I realized that it not only handled the unpacking process for the .pak file, but also contained most of the game's logic, which came in handy to join sound clips, icons, and models together.

The game actually does use SQLite to read asset associations from the `db.bytes` file (although in older version this file was encrypted and disguised as `UI.pak`. Another of God's little tests). I queried the information I needed from the `type_pet` table (containing the audio entries for each character), and translated some of the text from Chinese using DeepL.

The way the game loads and recomposes assets is unusual, and probably pretty efficient. Instead of leveraging Unity's built-in resource management APIs, the devs of this game wrote their own solution, operating directly on the .pak file in memory and dynamically resolving and caching assets.

Most prefab models use the `GTParamComponent` MonoBehaviour, storing json data in `m_StrParams`. For the purpose of my showcase, I had to use this data to map prefabs with bone structures to their respective skins. Most of this logic is found in the `ModelProxy.MergeSkin` method of the Geart3D assembly.

Most of what was left was deduplicating some assets (many "pets" share voice lines and models), setting up the scene (I used the one named `CD-JJC` as the base), and writing a script to load and display the character models, audio clips, animations and details. At last, I used the Unity Recorder package to create the video below.

{{ youtube(id="iBsfAkI0T28") }}
{% end %}