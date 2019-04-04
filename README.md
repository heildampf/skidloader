# Skidloader
Tool for importing Collection #1 data breach into MongoDB. 

Given any archive file as input, Skidloader will extract it, recursively search the archive for `.txt` file files that have an `email:password` format, and then load them into a single JSON file for easy importing into MongoDB. Archive formats such as `.zip, .gz, .bz2, .tar, tar.gz, tar.bz2, .tgz, and .tbz2` are all supported.


## Demo

[![asciicast](https://asciinema.org/a/238918.svg)](https://asciinema.org/a/238918)


## Usage
`$ skidloader <archive_file> <output_file.json>`

Then, you can import them into your MongoDB instance like this:

`$ mongoimport -d <database> -c <collection> --type json <output_file.json>`


## Download
You can download prebuilt binaries for Skidloader [here](https://github.com/petercunha/skidloader/releases)

- Mac: https://github.com/petercunha/skidloader/releases/download/1.0/skidloader-macos
- Windows: https://github.com/petercunha/skidloader/releases/download/1.0/skidloader-win.exe
- Linux: https://github.com/petercunha/skidloader/releases/download/1.0/skidloader-linux


## Running From Source
To run from source code instead of using the pre-built binaries, you can set up the project like this:

```
git clone https://github.com/petercunha/skidloader.git
cd skidloader
npm i
node skidloader.js <archive_file> <output_file.json>
```
