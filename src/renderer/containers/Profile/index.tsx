import { Avatar, Icon, Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";
import LineInput from "../../components/LineInput/index";

import {
    State,
} from "../../state/types";
import { getAvatarSrc, getFirstName, getLastName } from "../../state/user/selectors";

const styles = require("./style.css");

interface ProfileProps {
    className?: string;
    avatarSrc?: string;
    firstName: string;
    lastName: string;
}

interface ProfileState {
    isEditingName: boolean;
    firstNameNew: string;
    lastNameNew: string;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
    private nameInput?: Input;

    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            firstNameNew: props.firstName,
            isEditingName: false,
            lastNameNew: props.lastName,
        };
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.avatarContainer}>{this.getAvatar()}</div>
                {this.getName()}
            </div>
        );
    }

    private getAvatar = () => {
        const {
            avatarSrc,
            firstName,
            lastName,
        } = this.props;

        if (avatarSrc) {
            return <Avatar size="large" src={avatarSrc}/>;
        }

        return <Avatar size="large">{firstName.charAt(0) + lastName.charAt(0)}</Avatar>;
    }

    private getName = () => {
        const { firstNameNew, isEditingName, lastNameNew } = this.state;

        if (!isEditingName) {
            return (
              <div className={styles.nameReadOnly} onClick={this.setEditingTitle(true)}>
                  <h1>{firstNameNew}&nbsp;{lastNameNew}</h1>
                  <Icon
                    className={styles.editIcon}
                    type="edit"
                  />
              </div>
            );
        }

        return (
          <LineInput
              placeholder="Name"
              onChange={this.updateName}
              value={`${firstNameNew} ${lastNameNew}`}
              ref={(input) => { this.nameInput = input ? input.input : undefined; }}
              onBlur={this.setEditingTitle(false)}
          />
        );
    }

    private updateName = (event: ChangeEvent<HTMLInputElement>) => {
        const nameParts = event.target.value
            .split(" ")
            .filter((part) => !!part);
        const firstNameNew = nameParts[0];
        const lastNameNew = nameParts.length > 1 ? nameParts[1] : "";
        this.setState({
            firstNameNew,
            lastNameNew,
        });
    }

    private setEditingTitle = (value: boolean): () => void  => {
        return () => {
            if (!this.state.firstNameNew && !value) {
                return;
            }
            this.setState({isEditingName: value});
        };
    }
}

function mapStateToProps(state: State) {
    return {
        avatarSrc: getAvatarSrc(state),
        firstName: getFirstName(state),
        lastName: getLastName(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Profile);
