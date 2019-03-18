import { Avatar, Button, Modal } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";

import EditableText from "../../components/EditableText/index";
import LineInput from "../../components/LineInput/index";
import { getRequestsInProgressContains } from "../../state/feedback/selectors";
import { HttpRequestType } from "../../state/feedback/types";

import {
    State,
} from "../../state/types";
import { updateUser } from "../../state/user/actions";
import { getAvatarSrc, getEmail, getFirstName, getLastName } from "../../state/user/selectors";
import { UpdateUserAction, UpdateUserRequest } from "../../state/user/types";

const styles = require("./style.pcss");

interface ProfileProps {
    className?: string;
    avatarSrc?: string;
    firstName: string;
    lastName: string;
    email: string;
    saveChanges: (payload: UpdateUserRequest) => UpdateUserAction;
    saveInProgress: boolean;
}

interface ProfileState {
    emailNew: string;
    firstNameNew: string;
    isDirty: boolean;
    lastNameNew: string;
    password: string;
    showPasswordModal: boolean;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            emailNew: props.email,
            firstNameNew: props.firstName,
            isDirty: false,
            lastNameNew: props.lastName,
            password: "",
            showPasswordModal: false,
        };
    }

    public componentDidUpdate(prevProps: ProfileProps) {
        // todo don't do this if there was an error when saving
        if (prevProps.saveInProgress && !this.props.saveInProgress) {
            this.setState({
                password: "",
                showPasswordModal: false,
            });
        }
    }

    public render() {
        const { className, saveInProgress } = this.props;
        const {
            emailNew,
            firstNameNew,
            isDirty,
            lastNameNew,
            password,
            showPasswordModal,
        } = this.state;
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
                <a href="#" onClick={this.changePassword} className={styles.password}>Change Password</a>

                <Button
                    size={"large"}
                    disabled={!this.canSave()}
                    className={classNames(styles.save, {[styles.isHidden]: !isDirty})}
                    onClick={this.showPasswordModal}
                >
                    Save Changes
                </Button>
                <Modal
                    title="Enter Password To Continue"
                    visible={showPasswordModal}
                    onOk={this.save}
                    onCancel={this.cancelSave}
                    confirmLoading={saveInProgress}
                >
                    <LineInput
                        onChange={this.enterCurrentPassword}
                        onPressEnter={this.save}
                        type="password"
                        placeholder="Password"
                        value={password}
                        className={classNames(styles.currentPassword, {[styles.isHidden]: !showPasswordModal})}
                    />
                </Modal>
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
            return <Avatar size="large" src={avatarSrc} className={styles.avatar}/>;
        }

        return <Avatar size="large" className={styles.avatar}>{firstName.charAt(0) + lastName.charAt(0)}</Avatar>;
    }

    private updateName = (value: string) => {
        const nameParts = value
            .split(" ")
            .filter((part) => !!part);

        const firstNameNew = nameParts[0];
        const lastNameNew = nameParts.length > 1 ? nameParts[1] : "";

        const firstNameChanged = firstNameNew !== this.props.firstName;
        const lastNameChanged = lastNameNew !== this.props.lastName;
        const isDirty = this.state.isDirty ? true : firstNameChanged || lastNameChanged;

        this.setState({
            firstNameNew,
            isDirty,
            lastNameNew,
        });
    }

    private updateEmail = (value: string) => {
        const isDirty = this.state.isDirty ? true : value !== this.props.email;
        this.setState({
            emailNew: value,
            isDirty,
        });
    }

    private enterCurrentPassword = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: e.target.value,
        });
    }

    private changePassword = () => {
        // this.setState({showPasswordModal: true});
    }

    private canSave = () => {
        const { firstName, lastName, email } = this.props;
        const { firstNameNew, lastNameNew, emailNew } = this.state;
        const firstNameChanged = firstName !== firstNameNew;
        const lastNameChanged = lastName !== lastNameNew;
        const emailChanged = email !== emailNew;
        return emailChanged || firstNameChanged || lastNameChanged;
    }

    private save = () => {
        // todo password?
        const {
            firstNameNew: firstName,
            lastNameNew: lastName,
            emailNew: email,
            password,
        } = this.state;
        const user: UpdateUserRequest = {
            email: this.props.email,
            password,
            update: {
                email,
                firstName,
                lastName,
            },
        };
        this.props.saveChanges(user);
    }

    private cancelSave = () => {
        this.setState({
            password: "",
            showPasswordModal: false,
        });
    }

    private showPasswordModal = () => {
        this.setState({showPasswordModal: true});
    }
}

function mapStateToProps(state: State) {
    return {
        avatarSrc: getAvatarSrc(state) || "",
        email: getEmail(state) || "",
        firstName: getFirstName(state) || "",
        lastName: getLastName(state) || "",
        saveInProgress: getRequestsInProgressContains(state, HttpRequestType.UPDATE_USER),
    };
}

const dispatchToPropsMap = {
    saveChanges: updateUser,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Profile);
