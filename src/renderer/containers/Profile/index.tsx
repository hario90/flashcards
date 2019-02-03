import { Avatar } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import EditableText from "../../components/EditableText/index";

import {
    State,
} from "../../state/types";
import { getAvatarSrc, getEmail, getFirstName, getLastName } from "../../state/user/selectors";

const styles = require("./style.css");

interface ProfileProps {
    className?: string;
    avatarSrc?: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface ProfileState {
    emailNew: string;
    firstNameNew: string;
    lastNameNew: string;
    showPasswordInput: boolean;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            emailNew: props.email,
            firstNameNew: props.firstName,
            lastNameNew: props.lastName,
            showPasswordInput: false,
        };
    }

    public render() {
        const { className } = this.props;
        const { emailNew, firstNameNew, lastNameNew, showPasswordInput } = this.state;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.avatarContainer}>{this.getAvatar()}</div>
                <EditableText
                    value={`${firstNameNew} ${lastNameNew}`}
                    onBlur={this.updateName}
                    className={styles.name}
                    alwaysShowEditIcon={true}
                    placeholder="Name"
                />
                <EditableText
                    value={emailNew}
                    type="email"
                    onBlur={this.updateEmail}
                    className={styles.email}
                    alwaysShowEditIcon={true}
                    placeholder="Email"
                />
                <a href="#" onClick={this.changePassword}>Change Password</a>
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

    private updateName = (value: string) => {
        const nameParts = value
            .split(" ")
            .filter((part) => !!part);
        const firstNameNew = nameParts[0];
        const lastNameNew = nameParts.length > 1 ? nameParts[1] : "";
        this.setState({
            firstNameNew,
            lastNameNew,
        });
    }

    private updateEmail = (value: string) => {
        this.setState({emailNew: value});
    }

    private changePassword = () => {
        this.setState({showPasswordInput: true});
    }
}

function mapStateToProps(state: State) {
    return {
        avatarSrc: getAvatarSrc(state),
        email: getEmail(state),
        firstName: getFirstName(state),
        lastName: getLastName(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Profile);
