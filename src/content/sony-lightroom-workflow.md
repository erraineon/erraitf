+++
title = "My photography workflow"
date = 2025-07-12
description = "Nothing works like it should."
[taxonomies]
types=["memory"]
[extra]
+++
{% topic(title="The goal") %}
I wanted to automate importing RAW photos from my Sony a7RV to Lightroom Classic without requiring user interaction. It turned out a lot more involved than I thought.
{% end %}

{% topic(title="FTP, hold the S") %}
The first step is getting the files from the camera to the PC. Sony bodies conveniently feature Auto FTP Transfer, which automatically sends new photos to a specified network destination.

The main issue is that it doesn't support SFTP, even after enabling "Secure Protocol" under "Destination Settings." Upgrading to the latest firmware (3.00 as I'm writing this) didn't help. I ended up setting up an FTP server on my PC. I used [the one that comes with IIS](https://winscp.net/eng/docs/guide_windows_ftps_server).

Transfers take a bit, as each RAW file is about 70MB. The benefit is that the transfer starts as soon as the camera is within network range, and require no physical connection.
{% end %}

{% topic(title="Auto Importing into Lightroom") %}
Lightroom Classic offers an Auto-Import feature, but it doesn't let you organize photos hierarchically like the manual Import window does. The [feature request](https://community.adobe.com/t5/lightroom-classic-ideas/p-auto-import-to-folders-organized-by-date/idi-p/12249730) has been around since 2011.

The end goal involves exporting JPGs in a folder structure separated by year and month, as having thousands of images in the same folder makes loading said directory a slog every time.

Initially I figured to import all RAW files into one directory and, upon exporting them, divide them by date. I tried out the [LR/TreeExporter plugin](https://www.photographers-toolbox.com/products/lrtreeexporter.php), but it didn't let me parametrize the export directory as I needed.

Eventually I stumbled upon the [Folder Watch](https://regex.info/blog/lightroom-goodies/folder-watch) plugin which supplanted Lightroom's Auto-Import feature while offering a lot more control over the process. Setting the "Move file to" path to `D:\photos\{FileYYYY}\{FileMM}` achieved exactly what I needed. I also made sure to set the "Apply develop preset" setting to Optics > Lens + CA Correction to mimic the settings I had on the manual Import process.

The plugin works like a charm. It's bewildering to me that Lightroom doesn't offer something equivalent. I can't imagine wanting to achieve an automatic setup is that rare among photographers.
{% end %}

{% topic(title="Processing the photos") %}
I use a Smart Collection that lists all RAW and DNG files that weren't rejected and that weren't marked as red.
I select the Smart Collection and review imported photos, flag the ones I like with P and reject the rest with X. Then, once I finish developing them, I export them to JPG and mark them as red with 6, which removes them from the collection.

Finally, I keep track of the photos I already posted with another Smart Collection, which lists all JPG files that weren't marked as red.
{% end %}
