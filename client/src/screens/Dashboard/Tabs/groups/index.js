import React, {useEffect, useState} from 'react';
import {
    UncontrolledTooltip,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Input,
    Form,
    ModalFooter,
    Button
} from "reactstrap";

// Import Components
import Groups from "./groups";
import {isAdmin} from '../../../../helpers/authUtils';
import {withTranslation} from 'react-i18next';
import { createGroupApi, getAllGroupsApi } from '../../../../api/group';
import { GetAllGroups } from '../../../../hooks/reactQuery';

function GroupsComponent(props) {
    const {t} = props;
    const [modal, setModal] = useState(false);
    const [state, setState] = useState({groupName: ''});
    const {data: groups} = GetAllGroups()
    const [allGroups, setGroups] = useState(groups || []);
    const isadmin = isAdmin()

    useEffect(() => {
        setGroups(groups)
    }, [groups]);

    const handleChangeGroupName = (e) => {
        setState({groupName: e.target.value});
    }
    const hideModal = () => {
        setModal(false);
    }

    const createGroup = () => {
        createGroupApi(state.groupName).then(async (res) => {
            const data= await getAllGroupsApi()
            hideModal();
            setGroups(data);
        })
    }

    const AddNewGroup = () => {
        setModal(true);
    }

    console.log('modal', modal)
    return (
        <div className='h-screen '>
            <div className="flex-lg-row my-auto w-full justify-around bg-white">
                <div className='flex w-full flex-row justify-end py-1 px-8'>
                {
                    isadmin && 
                        <div id="pills-add-group-tab"
                           
                            onClick={AddNewGroup}>
                            <i className="text-2xl ri-play-list-add-line"></i>
                        </div>
          
                }
                     {
                    isadmin && 
                  <UncontrolledTooltip target="pills-add-group-tab" placement="top">
                        Add Group
                    </UncontrolledTooltip>
}
                </div>
                <Modal isOpen={modal}
                    centered
                    toggle={
                        () => hideModal()
                }>
                    <ModalHeader tag="h5" className="modal-title font-size-14"
                        toggle={
                            () => hideModal()
                    }>
                        {
                        t('Create New Group')
                    }</ModalHeader>
                    <ModalBody className="p-4">
                        <Form>
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="addgroupname-input">
                                    {
                                    t('Group Name')
                                }</Label>
                                <Input type="text" className="form-control" id="addgroupname-input"
                                    value={
                                        state.groupName
                                    }
                                    onChange={
                                        (e) => handleChangeGroupName(e)
                                    }
                                    placeholder="Enter Group Name"/>
                            </div>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="link"
                            onClick={
                                hideModal
                        }>
                            {
                            t('Close')
                        }</Button>
                        <Button type="button" color="primary"
                            onClick={createGroup}>Create Group</Button>
                    </ModalFooter>
                </Modal>
            </div>
            <div className="chat-leftsidebar me-lg-1 overflow-y-scroll">

                        <Groups setCurrentChat={
                            props.setCurrentChat
                        } groups={groups} allGroups={allGroups} setGroups={setGroups}/>
            </div>

        </div>
    );
}

export default withTranslation()(GroupsComponent);
