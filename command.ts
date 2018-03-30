// interface Command {
//   name: string,
//   description: string,
//
//   // handler: () => void,
//
//   // flags: CommandFlags,
//   // public aliases: Array<Alias>;
//   // public commands: Array<Command>;
//   // public description: string | undefined;
//   // public handler: Handler | undefined;
//   //
//   // constructor(flags: CommandFlags, aliases: Array<Alias>,
//   //           commands: Array<Command>, description?: string) {
//   // this.flags = flags;
//   // this.aliases = aliases;
//   // this.commands = commands;
//   // this.description = description;
//   // this.handler = void 0;
// }
//
// interface App {
//   name: string,
//   description: string,
//   commands: Array<Command>,
// }
//
// function runApp(app: App): Command {
//   return
// }
//
let app = {
  name: "generator",
  description: "",
  commands: [
    {
      name: "buildHome",
      description: "",
    },
    {
      name: "buildCourse",
      description: "",
    }
  ]
}

console.log(process.argv)

// run(app, process.argv)


//
//
//
// import { Command, CommandFlags, Handler, Alias, Flag, Description} from '../types';
//
// import { reduce } from 'ramda';
// import { addFlag } from '../utils';
//
// type accumulator = {
//   flags: CommandFlags,
//   aliases: Array<Alias>,
//   commands: Array<Command>,
//   description?: string
// }
//
// export function command(...definitions: Array<Alias | Flag | Description | Command>): Command {
//   const seed: accumulator = {
//     aliases: [],
//     flags: {},
//     commands: [],
//   };
//
//   const { flags, aliases, commands, description } = reduce(toType, seed, definitions);
//   return new ReginnCommand(flags, aliases, commands, description);
// }
//
// function toType (acc: accumulator, definition: Alias | Flag | Description | Command) {
//   if (definition.type === 'flag') {
//     return addFlag(acc, definition);
//   }
//
//   if (definition.type === 'alias') {
//     acc.aliases = acc.aliases.concat([ definition ]);
//   }
//
//   if (definition.type === 'command') {
//     acc.commands = acc.commands.concat([ definition ]);
//   }
//
//   if (definition.type === 'description') {
//     acc.description = definition.description;
//   }
//
//   return acc;
// }
//
// class ReginnCommand implements Command {
//   public type: 'command' = 'command';
//   public flags: CommandFlags;
//   public aliases: Array<Alias>;
//   public commands: Array<Command>;
//   public description: string | undefined;
//   public handler: Handler | undefined;
//
//   constructor(flags: CommandFlags, aliases: Array<Alias>,
//               commands: Array<Command>, description?: string) {
//     this.flags = flags;
//     this.aliases = aliases;
//     this.commands = commands;
//     this.description = description;
//     this.handler = void 0;
//   }
// }
