import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import { EmojiList } from '../EmojiList'

// Create a unique plugin key
const suggestionPluginKey = new PluginKey('emojiSuggestion')

const emojiList = [
  { name: 'smile', emoji: '😊' },
  { name: 'laugh', emoji: '😂' },
  { name: 'heart', emoji: '❤️' },
  { name: 'rocket', emoji: '🚀' },
  { name: 'fire', emoji: '🔥' },
  { name: 'thumbsup', emoji: '👍' },
  { name: 'sparkles', emoji: '✨' },
  { name: 'star', emoji: '⭐' },
  { name: 'wave', emoji: '👋' },
  { name: 'ok', emoji: '👌' },
  { name: 'party', emoji: '🎉' },
  { name: 'clap', emoji: '👏' },
  { name: 'cool', emoji: '😎' },
  { name: 'wink', emoji: '😉' },
  { name: 'think', emoji: '🤔' },
  { name: 'love', emoji: '😍' },
  { name: 'sad', emoji: '😢' },
  { name: 'angry', emoji: '😠' },
  { name: 'sunglasses', emoji: '😎' },
  { name: 'pizza', emoji: '🍕' },
  { name: 'coffee', emoji: '☕' },
  { name: 'rainbow', emoji: '🌈' },
  { name: 'moon', emoji: '🌙' },
  { name: 'sun', emoji: '☀️' },
  // Add more emojis as needed
]

export const EmojiSuggestion = Extension.create({
  name: 'emojiSuggestion',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: suggestionPluginKey,
        editor: this.editor,
        char: ':',
        items: ({ query }) => {
          return emojiList
            .filter(({ name }) => name.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 10)
        },
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(props.emoji)
            .run()
        },
        render: () => {
          let component
          let popup
          let suggestionProps

          return {
            onStart: props => {
              suggestionProps = props  // Store the props for later use
              component = new ReactRenderer(EmojiList, {
                props: {
                  ...props,
                  items: props.items,
                  command: ({ emoji }) => {
                    console.log("triggered")
                    props.command({ emoji })
                    popup?.[0].hide()
                  }
                },
                editor: this.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                zIndex: 9999,
              })
            },
            onUpdate(props) {
              suggestionProps = props  // Update stored props
              component?.updateProps({
                ...props,
                items: props.items,
                command: ({ emoji }) => {
                  props.command({ emoji })
                  popup?.[0].hide()
                }
              })
              popup?.[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown(props) {
              const { event } = props

              if (event.key === 'Escape') {
                popup?.[0].hide()
                return true
              }

              if (event.key === 'Enter') {
                event.preventDefault()
                const selectedItem = component?.ref?.getCurrentItem()
                if (selectedItem && suggestionProps?.command) {
                  suggestionProps.command({ emoji: selectedItem.emoji })
                  popup?.[0].hide()
                }
                return true
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault()
                component?.ref?.upHandler()
                return true
              }

              if (event.key === 'ArrowDown') {
                event.preventDefault()
                component?.ref?.downHandler()
                return true
              }

              return false
            },
            onExit() {
              popup?.[0].destroy()
              component?.destroy()
            },
          }
        },
      }),
    ]
  },
}) 