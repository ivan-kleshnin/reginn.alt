import * as R from "@paqmind/ramda"
import parse from "./parser"
import {bold, bgWhite, bgGreen, bgRed, red, white} from "cli-colors"
import * as readline from "readline"
import {inspect} from "util"

R.reduce2 = R.addIndex(R.reduce)

let sleep = (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// LIBRARY
let command = (opts) => {
  let data = R.merge({
    name: "",
    description: "...",
    version: "1.0",
    flags: {},
    commands: [],
    args: [],
    handler: R.id,
  }, opts)

  if (!data.name) {
    throw Error("command name is required") // TODO or maybe with TS!
  }

  return data
}

let splitFlags = (args) => {
  return R.is(Object, args[0]) ? args : R.prepend({}, args)
}

let interpretCommand = async (argv, command, ctx) => {
  let [flags, ...args] = splitFlags(argv)

  if (command.commands.length) {
    // TODO compare flags with cli.flags
    let command2 = R.find(R.propEq("name", args[0]), command.commands)
    if (!command2) {
      console.log(`unsupported command ${inspect(args[0])}`)
      process.exit()
    }

    if (command.handler) {
      console.log(bgGreen(" API "))
      ctx = await command.handler(ctx, flags, {}) || ctx
      await sleep(1000)
    }

    await interpretCommand(R.tail(args), command2, ctx)
  }
  else if (command.args.length) {
    // TODO compare flags with cli.flags
    let argObj = R.reduce2((z, commandArg, i) => {
      let arg = args[i]
      if (commandArg.required && !arg) {
        console.error(`missing arg ${inspect(commandArg.name)}`)
        process.exit(1)
      }
      z[commandArg.name] = arg
      return z
    }, {}, command.args)

    if (args.length > R.keys(argObj).length) {
      console.error(bgRed(" API "))
      console.error(bold(process.argv.slice(2).join(" ")))
      console.error(red(`Extra arg ${bold(inspect(R.takeLast(1, args)[0]))}`))
      process.exit(1)
    }

    console.log(bgGreen(" API "))
    await command.handler(ctx, flags, argObj)
    await sleep(1000)
  }
  else {
    console.log(bgGreen(" API "))
    await command.handler(ctx, flags, {})
    await sleep(1000)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// API
let pullCommand = command({
  name: "pull",
  args: [
    {
      name: "repo",
      required: false,
    },
    {
      name: "branch",
      required: false,
    },
  ],
  handler: async (ctx, flags, args) => {
    console.log(bold("> cli pull [repo] [branch]"))
    console.log("ctx:", ctx)
    console.log("flags:", flags)
    console.log("args:", args)
    return ctx
  }
})

let remoteAddCommand = command({
  name: "add",
  args: [
    {
      name: "repo",
      required: true,
    },
    {
      name: "url",
      required: true,
    }
  ],
  handler: async (ctx, flags, args) => {
    console.log(bold("> cli remote add <repo> <url>"))
    console.log("ctx:", ctx)
    console.log("flags:", flags)
    console.log("args:", args)
    return ctx
  }
})

let remoteRmCommand = command({
  name: "rm",
  args: [
    {
      name: "repo",
      required: true,
    }
  ],
  handler: async (ctx, flags, args) => {
    console.log(bold("> cli remote rm <repo>"))
    console.log("ctx:", ctx)
    console.log("flags:", flags)
    console.log("args:", args)
    return ctx
  }
})

let remoteCommand = command({
  name: "remote",
  commands: [remoteAddCommand, remoteRmCommand],
  handler: async (ctx, flags, args) => {
    console.log(bold("> cli remote {command}"))
    console.log("ctx:", ctx)
    console.log("flags:", flags)
    console.log("args:", args)
    return R.assoc("c2", "c2", ctx)
  }
})

let cli = command({
  name: "cli",
  commands: [pullCommand, remoteCommand],
  handler: async (ctx, flags, args) => {
    console.log(bold("> cli {command}"))
    console.log("ctx:", ctx)
    console.log("flags:", flags)
    console.log("args:", args)
    return R.assoc("c1", "c1", ctx)
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////
// RUN
let expr = process.argv.slice(2).join(" ") || ""
let parseResult = parse(expr)
process.stdout.write(bgWhite(" PARSE "))
setTimeout(() => {
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
  if (parseResult.status) {
    console.log(bgGreen(" PARSE "))
    console.log(bold("> " + expr))
    interpretCommand(parseResult.value, cli, {})
  }
  else {
    console.log(bgRed(" PARSE "))
    console.log(bold("> " + expr))
    console.log(red("-" + "-".repeat(parseResult.index.offset) + "^"))
    console.log(red("Expected one of: " + parseResult.expected.join(", ")))
  }
}, 1200)
