
// 'Plugin<[] | [Processor<any, any, any, any>, (Options | undefined)?] | [null | undefined, (Options | undefined)?] | [Options], Root, Root>'
// /**
//    * Processor allows plugins, parsers, and compilers to be chained together to transform content.
//    *
//    * @typeParam P Processor settings. Useful when packaging unified with a preset parser and compiler.
//    */
//  interface Processor<P = Settings> extends FrozenProcessor<P> {
//   /**
//    * Configure the processor to use a plugin and optionally configure that plugin with options.
//    *
//    * @param plugin unified plugin
//    * @param settings Configuration for plugin
//    * @typeParam S Plugin settings
//    * @returns The processor on which use is invoked
//    */
//   use<S extends any[] = [Settings?]>(
//     plugin: Plugin<S, P>,
//     ...settings: S
//   ): Processor<P>

//   /**
//    * Configure the processor with a preset to use
//    *
//    * @param preset `Object` with an plugins (set to list), and/or an optional settings object
//    */
//   use<S extends any[] = [Settings?]>(preset: Preset<S, P>): Processor<P>

//   /**
//    * Configure using a tuple of plugin and setting(s)
//    *
//    * @param pluginTuple pairs, plugin and settings in an array
//    * @typeParam S Plugin settings
//    */
//   use<S extends any[] = [Settings?]>(
//     pluginTuple: PluginTuple<S, P>
//   ): Processor<P>

//   /**
//    * A list of plugins and presets to be applied to processor
//    *
//    * @param list List of plugins, presets, and pairs
//    */
//   use(list: PluggableList<P>): Processor<P>

//   /**
//    * Configuration passed to a frozen processor
//    *
//    * @param processorSettings Settings passed to processor
//    */
//   use(processorSettings: ProcessorSettings<P>): Processor<P>
// }


// // import { Processor, Options } from 'unified';
// // import type { Root as HastRoot } from 'hast';
// // import type { Root as MdastRoot } from 'mdast';

// // // declare namespace plugin {
// //   // remarkRehype: https://github.com/remarkjs/remark-rehype/blob/main/lib/index.js#L37
// // export type PluginRemarkRehype<[Processor, Options?]|[null|undefined, Options?]|[Options]|[], MdastRoot>;
// //   // rehypeRemark: https://github.com/rehypejs/rehype-remark/blob/main/lib/index.js#L25
// // export type PluginRehypeRemark<[Processor, Options?], HastRoot|[Options?]|void[], HastRoot, MdastRoot>;
// //   // type Plugin<[Options?]|void[], HastRoot, MdastRoot>;
// // // }

// // //   /**
// // //    * A Plugin (Attacher) is the thing passed to `use`.
// // //    * It configures the processor and in turn can receive options.
// // //    *
// // //    * Attachers can configure processors, such as by interacting with parsers and compilers, linking them to other processors, or by specifying how the syntax tree is handled.
// // //    *
// // //    * @param settings Configuration
// // //    * @typeParam S Plugin settings
// // //    * @typeParam P Processor settings
// // //    * @returns Optional Transformer.
// // //    */
// // //    type Plugin<S extends any[] = [Settings?], P = Settings> = Attacher<S, P>


// // // declare namespace unified {
// // //   /**
// // //    * Processor allows plugins, parsers, and compilers to be chained together to transform content.
// // //    *
// // //    * @typeParam P Processor settings. Useful when packaging unified with a preset parser and compiler.
// // //    */
// // //   interface Processor<P = Settings> extends FrozenProcessor<P> {
// // //     /**
// // //      * Configure the processor to use a plugin and optionally configure that plugin with options.
// // //      *
// // //      * @param plugin unified plugin
// // //      * @param settings Configuration for plugin
// // //      * @typeParam S Plugin settings
// // //      * @returns The processor on which use is invoked
// // //      */
// // //     use<S extends any[] = [Settings?]>(
// // //       plugin: Plugin<S, P>,
// // //       ...settings: S
// // //     ): Processor<P>

// // //     /**
// // //      * Configure the processor with a preset to use
// // //      *
// // //      * @param preset `Object` with an plugins (set to list), and/or an optional settings object
// // //      */
// // //     use<S extends any[] = [Settings?]>(preset: Preset<S, P>): Processor<P>

// // //     /**
// // //      * Configure using a tuple of plugin and setting(s)
// // //      *
// // //      * @param pluginTuple pairs, plugin and settings in an array
// // //      * @typeParam S Plugin settings
// // //      */
// // //     use<S extends any[] = [Settings?]>(
// // //       pluginTuple: PluginTuple<S, P>
// // //     ): Processor<P>

// // //     /**
// // //      * A list of plugins and presets to be applied to processor
// // //      *
// // //      * @param list List of plugins, presets, and pairs
// // //      */
// // //     use(list: PluggableList<P>): Processor<P>

// // //     /**
// // //      * Configuration passed to a frozen processor
// // //      *
// // //      * @param processorSettings Settings passed to processor
// // //      */
// // //     use(processorSettings: ProcessorSettings<P>): Processor<P>
// // //   }
// // // }
