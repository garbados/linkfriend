/* eslint-disable no-unused-vars */

import Downshift from 'downshift/preact'
import { h, Component } from 'preact'

export default class Typeahead extends Component {
  constructor (props) {
    super(props)
    this.setState({
      inputValue: props.defaultInputValue || ''
    })
  }

  render ({
    label,
    placeholder,
    items
  }, {
    inputValue
  }) {
    const getItems = ({
      isOpen,
      inputValue,
      getItemProps,
      highlightedIndex
    }) => {
    }
    return (
      <Downshift defaultInputValue={inputValue}>
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem
        }) => {
          const entries = inputValue.split(',').map(s => s.trim())
          const currentEntries = entries.slice(0, -1)
          const pendingEntry = entries.slice(-1)
          const menuItems = pendingEntry.length
            ? items
              .filter((item, index) => {
                return item.includes(pendingEntry) && !currentEntries.includes(item)
              })
              .map((item, index) => (
                <li
                  {...getItemProps({
                    key: item,
                    index,
                    item: [...currentEntries, item].join(', ')
                  })}
                >
                  <a class={highlightedIndex === index ? 'is-active' : ''}>{item}</a>
                </li>
              ))
            : null
          const menu = (isOpen && menuItems.length)
            ? (
              <aside class='menu'>
                <ul {...getMenuProps({
                  isOpen,
                  class: 'menu-list box'
                })}>
                  {menuItems}
                </ul>
              </aside>
            )
            : null
          return (
            <div>
              <label {...getLabelProps({ class: 'label' })}>{label}</label>
              <input
                {...getInputProps({
                  class: 'input',
                  type: 'text',
                  placeholder
                })}
              />
              {menu}
            </div>
          )
        }}
      </Downshift>
    )
  }
}
