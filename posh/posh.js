/*

    PoSh - Poshlosti Shell

*/

async function findExecutable(command, wants_ext, always_cwd) {
    let executable = command
    if (!executable.startsWith("/")) {
        if (executable.includes("/") || always_cwd) {
            executable = terminal.cwd + "/" + executable
        } else {
            executable = "/app/" + executable
        }
    }
    for (let ext of wants_ext) {
        if (!hasFile(executable) && hasFile(executable + ext)) {
            executable = executable + ext
        }
    }
    executable = simplifyPath(executable)
    if (hasFile(executable)) {
        return executable
    } else {
        return null
    }
}

async function processCommand(command, args) {
    let executable = await findExecutable(command, [".js",".sh",".posh"], false)
    if (executable != null) {
        try {
            let code = await executeCommand([executable].concat(args), terminal).promise
            if (code != 0) {
                await writeStdout("\nСтатус код: "+code+"\n")
            }
        } catch (e) {
            console.log(e)
            await writeStdout("Не запустилася:\n"+e+"\n")
        }
    } else {
        await writeStdout("Твоя команда "+command+" не найдена :3\n")
    }
}

async function processShell(command, args) {
    let executable = await findExecutable(command, [".sh",".posh"], true)
    if (executable != null) {
        let script = readFile(executable)

        for (let line of script.split("\n")) {
            let words = line.split(" ")
            await processCommand(words[0], words.slice(1))
        }
    } else {
        await writeStdout("Твоя команда "+command[0]+" не найдена :3\n")
    }
}

async function processArgs(args) {
    let is_shell = true
    let skip_keys = false
    let command = []
    
    for (let arg of args) {
        if (!skip_keys) {
            if (arg == "-c") {
                is_shell = false
                skip_keys = true
                continue
            } else if (arg == "-h") {
                await writeStdout("использование: posh [-c] [--] [команда] [аргументы]\nбез -с типа обычный .sh запускается\n")
                return false
            } else if (arg == "--") {
                skip_keys = true
                continue
            }
        }
        
        command.push(arg)
    }

    if (is_shell) {
        await processShell(command[0], command.slice(1))
        return false
    } else {
        await processCommand(command[0], command.slice(1))
    }

    return true
}

async function main(args) {
    if (args.length > 1) {
        if (!await processArgs(args.slice(1))) {
            return 0
        }
    }

    let history = [""]
    let history_index = 0

    let config = JSON.parse(readFile("/config/posh.json"))
    let prompt = config["prompt"]
    
    await processShell("/config/poshrc", [])

    while (true) {
        await writeStdout(prompt.replace("{cwd}", terminal.cwd))

        let command = await readLine((key, ctrl, alt, shift, content, pos) => {
            if (key == "ArrowDown") {
                history_index = Math.max(0, history_index - 1)
                return [history[history_index], history[history_index].length]
            }
        
            if (key == "ArrowUp") {
                history_index = Math.min(history.length-1, history_index + 1)
                return [history[history_index], history[history_index].length]
            }
        
            return [content, pos]
        })

        if (command.length > 0) {
            history.splice(1, 0, command);
            history_index = 0

            let args = command.split(" ")
            command = args[0]
            args = args.slice(1)
    
            if (command == "exit") {
                if (args.length == 0) {
                    return 0
                } else {
                    return parseInt(args[0])
                }
            } else {
                await processCommand(command, args)
            }
        }
    }

    return 0
}
