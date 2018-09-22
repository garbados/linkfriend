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

  getMenuItems ({ getInputProps, getItemProps, highlightedIndex, inputValue, items }) {
    const entries = inputValue.split(',').map(s => s.trim())
    const currentEntries = entries.slice(0, -1)
    const pendingEntry = entries.slice(-1)[0]
    return pendingEntry.length
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
  }

  getMenu ({
    getMenuProps,
    isOpen,
    menuItems,
  }) {
    return (isOpen && menuItems && menuItems.length)
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
  }

  render ({
    label,
    placeholder,
    items
  }, {
    inputValue
  }) {
    return (
      <Downshift defaultInputValue={inputValue}>
        {(downshift) => {
          const menuItems = this.getMenuItems({
            items,
            ...downshift
          })
          const menu = this.getMenu({
            label,
            menuItems,
            placeholder,
            ...downshift
          })
          return (
            <div>
              <label {...downshift.getLabelProps({ class: 'label' })}>{label}</label>
              <input
                {...downshift.getInputProps({
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
