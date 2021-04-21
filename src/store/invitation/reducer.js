import produce from "immer";
import {
  GET_INVITATIONS,
  GET_INVITATIONS_SUCCESS,
  GET_INVITATIONS_ERROR,
  CREATE_INVITATION,
  CREATE_INVITATION_SUCCESS,
  CREATE_INVITATION_ERROR,
  ACCEPT_INVITATION,
  ACCEPT_INVITATION_SUCCESS,
  ACCEPT_INVITATION_ERROR,
  APPROVE_INVITATION,
  APPROVE_INVITATION_SUCCESS,
  APPROVE_INVITATION_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  owners: [],
  error: false,
  invitationLink: "",
  log: "",
  success: false,
  creating: false,
  approving: false,
  setupCompleted: false,
  createdBy: "",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_INVITATIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_INVITATIONS_SUCCESS:
        draft.loading = false;
        draft.owners = action.owners;
        draft.createdBy = action.createdBy;
        draft.setupCompleted = action.setupCompleted;
        break;

      case GET_INVITATIONS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case CREATE_INVITATION:
        draft.creating = true;
        draft.error = false;
        draft.success = false;
        break;

      case CREATE_INVITATION_SUCCESS:
        draft.creating = false;
        draft.invitationLink = action.invitationLink;
        draft.log = action.log;
        draft.success = true;
        break;

      case CREATE_INVITATION_ERROR:
        draft.creating = false;
        draft.error = action.error;
        draft.success = false;
        break;

      case ACCEPT_INVITATION:
        draft.loading = true;
        draft.error = false;
        draft.success = false;
        break;

      case ACCEPT_INVITATION_SUCCESS:
        draft.loading = false;
        draft.log = action.log;
        draft.success = true;
        break;

      case ACCEPT_INVITATION_ERROR:
        draft.loading = false;
        draft.error = action.error;
        draft.success = false;
        break;

      case APPROVE_INVITATION:
        draft.approving = true;
        draft.error = false;
        draft.success = false;
        break;

      case APPROVE_INVITATION_SUCCESS:
        draft.approving = false;
        draft.invitationLink = action.invitationLink;
        draft.log = action.log;
        draft.success = true;
        break;

      case APPROVE_INVITATION_ERROR:
        draft.approving = false;
        draft.error = action.error;
        draft.success = false;
        break;
    }
  });

export default reducer;
