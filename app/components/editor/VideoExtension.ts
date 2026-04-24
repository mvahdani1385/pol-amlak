import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; controls?: boolean; autoplay?: boolean; muted?: boolean; loop?: boolean }) => ReturnType
    }
  }
}

export const VideoExtension = Node.create<VideoOptions>({
  name: 'video',

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
        default: 'max-width: 100%; border-radius: 12px;',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: HTMLAttributes.controls !== false ? 'true' : null,
        autoplay: HTMLAttributes.autoplay === true ? 'true' : null,
        muted: HTMLAttributes.muted === true ? 'true' : null,
        loop: HTMLAttributes.loop === true ? 'true' : null,
      }),
      ['source', { src: HTMLAttributes.src, type: 'video/mp4' }]
    ]
  },

  addCommands() {
    return {
      setVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
