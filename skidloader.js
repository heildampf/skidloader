const fs = require('fs')
const inly = require('inly')
const log = require('fancy-log')
const path = require('path')
const glob = require('glob')
const readline = require('readline')
const rimraf = require('rimraf')

let cwd = process.cwd()
let to = path.join(cwd, 'dataload_temp')
let name
let from
let writeStream

main()

function main() {
	let args = process.argv
	if (args.length < 4) {
		console.error('Usage: skidloader <archive_file> <output_file.json>')
		return
	} else {
		name = path.join(args[2])
		from = path.join(cwd, name)
		writeStream = fs.createWriteStream(path.join(args[3]))
	}

	// Begin extraction process
	log.info('Starting Skidloader!')
	extract()
}

// End of program
function cleanup() {
	writeStream.close()
	log.info('Cleaning up temporary files...')
	rimraf(to, function() {
		finish()
	})
}

function finish() {
	log.info('Finished Skidloader!')
}

// Extracts archive to folder
function extract() {
	log.info('Extracting archive...')

	const extract = inly(from, to)

	extract.on('error', error => {
		console.error(error)
	})

	extract.on('end', () => {
		log.info('Extraction finished!')

		enumerateFiles()
	})
}

// Enumerate files in extracted folder
function enumerateFiles() {
	glob(path.join(to, '**/*.txt'), (err, files) => {
		if (err) throw err

		log.info(files.length + ' files detected!')
		convertToJSON(files)
	})
}

// Converts files in extracted folder to JSON
function convertToJSON(files) {
	let completed = 0

	for (var i = 0; i < files.length; i++) {
		const filename = files[i]
		const rl = readline.createInterface({
			input: fs.createReadStream(filename)
		})

		log.info(`Streaming data from file ${i + 1}/${files.length}`)

		rl.on('line', line => {
			try {
				const dataArr = line.split(':')
				if (!validateEmail(dataArr[0])) {
					return
				}

				const data = JSON.stringify({
					email: dataArr[0],
					password: dataArr[1]
				})

				writeStream.write(data + '\n')
			} catch (error) {}
		})

		rl.on('close', line => {
			completed++
			log.info(`${completed}/${files.length} files complete`)

			if (completed >= files.length) {
				log.info('Export finished!')
				cleanup()
			}
		})
	}
}

// Utility: validates email
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email))
}
