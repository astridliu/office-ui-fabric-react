/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { BaseComponent, autobind, css, getId } from '../../../../Utilities';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { ISelectedPeopleItemProps } from '../SelectedPeopleList';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as stylesImport from './ExtendedSelectedItem.scss';
// tslint:disable-next-line:no-any
const styles: any = stylesImport;

export interface IPeoplePickerItemState {
  contextualMenuVisible: boolean;
}

export class ExtendedSelectedItem extends BaseComponent<ISelectedPeopleItemProps, IPeoplePickerItemState> {
  protected persona: HTMLElement;

  constructor(props: ISelectedPeopleItemProps) {
    super(props);
    this.state = { contextualMenuVisible: false };
  }

  public render(): JSX.Element {
    let {
      item,
      onExpandItem,
      onRemoveItem,
      removeButtonAriaLabel,
      index,
      selected
    } = this.props;
    const itemId = getId();
    return (
      <div
        ref={ this._resolveRef('persona') }
        className={ css(
          'ms-PickerPersona-container',
          styles.personaContainer,
          { ['is-selected ' + styles.personaContainerIsSelected]: selected },
          { ['is-invalid ' + styles.validationError]: !item.isValid }
        ) }
        data-is-focusable={ true }
        data-is-sub-focuszone={ true }
        data-selection-index={ index }
        role={ 'listitem' }
        aria-labelledby={ 'selectedItemPersona-' + itemId }
        onContextMenu={ this._onClick }
      >
        <div hidden={ !item.canExpand || onExpandItem === undefined }>
          <IconButton
            onClick={ this._onClickIconButton(onExpandItem) }
            iconProps={ { iconName: 'Add', style: { fontSize: '14px' } } }
            className={ css('ms-PickerItem-removeButton', styles.expandButton, styles.actionButton) }
            ariaLabel={ removeButtonAriaLabel }
          />
        </div>
        <div className={ css(styles.personaWrapper) }>
          <div
            className={ css('ms-PickerItem-content', styles.itemContent) }
            id={ 'selectedItemPersona-' + itemId }
          >
            <Persona
              { ...item }
              onRenderCoin={ this.props.renderPersonaCoin }
              onRenderPrimaryText={ this.props.renderPrimaryText }
              size={ PersonaSize.size32 }
            />
          </div>
          <IconButton
            onClick={ this._onClickIconButton(onRemoveItem) }
            iconProps={ { iconName: 'Cancel', style: { fontSize: '14px' } } }
            className={ css('ms-PickerItem-removeButton', styles.removeButton, styles.actionButton) }
            ariaLabel={ removeButtonAriaLabel }
          />
        </div >
        { this.state.contextualMenuVisible ? (
          <ContextualMenu
            items={ this.props.menuItems }
            shouldFocusOnMount={ true }
            target={ this.persona }
            onDismiss={ this._onCloseContextualMenu }
            directionalHint={ DirectionalHint.bottomAutoEdge }
          />)
          : null
        }
      </div >);
  }

  private _onClickIconButton(action: (() => void) | undefined): (ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void {
    return (ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>): void => {
      ev.stopPropagation();
      ev.preventDefault();
      if (action) {
        action();
      }
    };
  }

  @autobind
  private _onClick(ev: React.MouseEvent<HTMLElement>): void {
    ev.preventDefault();
    this.setState({ contextualMenuVisible: true });
  }

  @autobind
  private _onCloseContextualMenu(ev: Event): void {
    this.setState({ contextualMenuVisible: false });
  }
}