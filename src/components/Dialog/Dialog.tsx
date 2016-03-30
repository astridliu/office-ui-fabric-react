import * as React from 'react';
import './Dialog.scss';
import { css } from '../../utilities/css';

// @TODO - need to add animations, pending Fabric Team + Coulton work

export enum DialogType {
    normal,
    largeHeader,
    close
}

export interface IDialogProps {
    type?: DialogType;
    onDismiss?: (ev?: React.MouseEvent) => any;
    title?: string;
    subText?: string;
    blocking?: boolean;
    children?: any;
}

export class DialogFooter extends React.Component<any, any> {
    public render() {
        return (
            <div className='ms-Dialog-actions'>
                <div className='ms-Dialog-actionsRight'>
                    { this._renderChildrenAsActions() }
                </div>
            </div>
        );
    }

    private _renderChildrenAsActions() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                className: 'ms-Dialog-action'
            });
        }.bind(this));
    }
}

export default class Dialog extends React.Component<IDialogProps, any> {
    public static defaultProps: IDialogProps = {
        type: DialogType.normal,
        blocking: false
    };

    public render() {
        let { type, onDismiss, title, subText, blocking } = this.props;

        console.log('type: ' + type);
        console.log('blocking: ' + blocking);

        const dialogClassName = css('ms-Dialog', {
            'ms-Dialog--lgHeader': type === DialogType.largeHeader,
            'ms-Dialog--close': type === DialogType.close
        });

        const overlayClassName = css('ms-Overlay', {
            'ms-Overlay--dark': !blocking,
        });

        let subTextContent;
        if (subText) {
            subTextContent = <p className='ms-Dialog-subText'>{ subText }</p>;
        }

        return (
            <div className={ dialogClassName }>
                <div className={ overlayClassName } onClick={ blocking ? null : onDismiss}></div>
                <div className='ms-Dialog-main'>
                    <button className='ms-Dialog-button ms-Dialog-button--close' onClick={ onDismiss }>
                        <i className='ms-Icon ms-Icon--x'></i>
                    </button>
                    <div className='ms-Dialog-header'>
                        <p className='ms-Dialog-title'>{ title }</p>
                    </div>
                    <div className='ms-Dialog-inner'>
                        <div className='ms-Dialog-content'>
                            { subTextContent }
                            { this._renderChildrenContent() }
                        </div>
                        { this._renderChildrenButtons() }
                    </div>
                </div>
            </div>
        );
    }

    private _renderChildrenContent() {
        return React.Children.map(this.props.children, function (child) {
          if (child.type === DialogFooter) {
              return null;
          } else {
            return child;
          }
        }.bind(this));
    }

    private _renderChildrenButtons() {
        return React.Children.map(this.props.children, function (child) {
          if (child.type === DialogFooter) {
              return child;
          } else {
            return null;
          }
        }.bind(this));
    }
};
