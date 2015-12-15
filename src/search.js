/**
 * Search module
 * A simple search component.
**/
import SearchItemInArray from './SearchItemInArray'
import React, { Component, PropTypes } from 'react'

class Search extends Component {

  static get defaultProps () {
    return {
      ItemElement: 'a',
      classPrefix: 'react-search'
    }
  }

  static get propTypes () {
    return {
      AutoCompleteListElem: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
        PropTypes.node,
        PropTypes.string
      ]),
      classPrefix: PropTypes.string,
      customSearchFn: PropTypes.func,
      items: PropTypes.array.isRequired,
      keys: PropTypes.array,
      searchKey: PropTypes.string,
      placeHolder: PropTypes.string,
      onChange: PropTypes.func,
      onClick: PropTypes.func,
      hiddenClassName: PropTypes.string,
      openClassName: PropTypes.string,
      ItemElement: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
        PropTypes.node,
        PropTypes.string
      ]),
      inputProps: PropTypes.object,
      inputWrapperProps: PropTypes.object,
      itemProps: PropTypes.object,
      autoCompleteListProps: PropTypes.object,
      autoCompleteWrapperProps: PropTypes.object,
      wrapperProps: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    this.search = typeof this.props.customSearchFn === 'function' ? this.props.customSearchFn : SearchItemInArray
    this.state = {
      matchingItems: []
    }
  }

  changeInput (e) {
    if (typeof this.props.onChange !== 'undefined') {
      this.props.onChange(e)
    }

    let autocomplete = this.refs.autocomplete
    autocomplete.className = toggleAutoCompleteClass(autocomplete.className, false, this.props)
    let searchValue = this.refs.searchInput.value
    let result = this.search(this.props.items, searchValue)
    this.setState({matchingItems: result})
  }

  selectAutoComplete (e) {
    if (typeof this.props.onClick !== 'undefined') {
      this.props.onClick(e)
    }

    let autocomplete = this.refs.autocomplete
    autocomplete.className = toggleAutoCompleteClass(autocomplete.className, true, this.props)
    let result = e.target.innerHTML
    this.refs.searchInput.value = result
  }

  render () {
    const {
      AutoCompleteListElem = 'ul',
      ItemElement = 'li',
      inputProps = {},
      inputWrapperProps = {},
      itemProps = {},
      autoCompleteListProps = {},
      autoCompleteWrapperProps = {},
      wrapperProps = {}
    } = this.props
    const inputClassName = `${this.props.classPrefix}__input`
    const menuClassName = `${this.props.classPrefix}__menu ${this.props.hiddenClassName}`

    let items = []

    if ((this.props.keys !== undefined)) {
      /* items for hash results */
      items = this.state.matchingItems.map((item, i) => {
        return (
          <li key={i}
              className={`${this.props.classPrefix}__menu-item`}
              onClick={this.selectAutoComplete.bind(this)}>
            {
              this.props.keys.map((itemKey, j) => {
                return (
                  <ItemElement key={j}>
                  { item[itemKey] }
                  </ItemElement>
                )
              })
            }
          </li>
        )
      })
    } else {
      /* items for a simple array */
      items = this.state.matchingItems.map((item, i) => (
        <ItemElement
            className={`${this.props.classPrefix}__menu-item`}
            key={i}
            {...itemProps}
            {...item}
            onClick={this.selectAutoComplete.bind(this)}
        >
          {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
        </ItemElement>
      ))
    }

    return (
      <div className={this.props.classPrefix} {...wrapperProps}>
        <div {...inputWrapperProps}>
          <input
              type='text'
              className={inputClassName}
              placeholder={this.props.placeHolder}
              ref='searchInput'
              onKeyUp={this.changeInput.bind(this)}
              {...inputProps}
          />
        </div>

        <div className={menuClassName} ref='autocomplete' {...autoCompleteWrapperProps}>
          <AutoCompleteListElem className={`${this.props.classPrefix}__menu-items`} {...autoCompleteListProps}>
            {items}
          </AutoCompleteListElem>
        </div>

      </div>
    )
  }
}

function toggleAutoCompleteClass (className, isOpen, props) {
  const hiddenClassName = getHiddenClassName(props)
  const openClassName = getOpenClassName(props)
  if (isOpen) {
    return className.replace(openClassName, hiddenClassName)
  }
  return className.replace(hiddenClassName, openClassName)
}

function getHiddenClassName (props) {
  let hiddenClassName = props.hiddenClassName
  if (hiddenClassName == null) {
    hiddenClassName = `${props.classPrefix}__menu--hidden`
  }
  return hiddenClassName
}

function getOpenClassName (props) {
  let openClassName = props.openClassName
  if (openClassName == null) {
    openClassName = `${props.classPrefix}__menu--open`
  }
  return openClassName
}

module.exports = Search
