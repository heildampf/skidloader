# Skidloader
Tool for importing Collection #1 data breach into MongoDB. 

Given any archive file as input, Skidloader will extract it, recursively search the archive for text file files that have an `email:password` format, and then load them into a single JSON file for easy importing into MongoDB.

## Usage
`$ skidloader <archive_file> <output_file.json>`

Then, you can import them into your MongoDB instance like this:

`$ mongoimport -d <database> -c <collection> --type json <output_file.json>`
