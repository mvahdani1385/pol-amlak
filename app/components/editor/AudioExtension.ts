import { Node, mergeAttributes } from '@tiptap/core'

export interface AudioOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (options: { src: string; controls?: boolean; autoplay?: boolean; muted?: boolean; loop?: boolean }) => ReturnType
    }
  }
}

export const AudioExtension = Node.create<AudioOptions>({
  name: 'audio',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
        parseHTML: element => element.getAttribute('controls') === 'true',
      },
      autoplay: {
        default: false,
        parseHTML: element => element.getAttribute('autoplay') === 'true',
      },
      muted: {
        default: false,
        parseHTML: element => element.getAttribute('muted') === 'true',
      },
      loop: {
        default: false,
        parseHTML: element => element.getAttribute('loop') === 'true',
      },
      style: {
        default: 'width: 100%; margin: 10px 0;',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'audio',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'audio',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: HTMLAttributes.controls !== false ? 'true' : null,
        autoplay: HTMLAttributes.autoplay === true ? 'true' : null,
        muted: HTMLAttributes.muted === true ? 'true' : null,
        loop: HTMLAttributes.loop === true ? 'true' : null,
      }),
      ['source', { src: HTMLAttributes.src, type: 'audio/mp3' }]
    ]
  },

  addCommands() {
    return {
      setAudio: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
