import createUser from './createUser';
import isUserRegistered from './isUserRegistered';
import isCredentialsCorrect from './isCredentialsCorrect';
import getUserCtxFromEmail from './getUserCtxFromEmail';

class UserStore {}

UserStore.createUser = createUser;
UserStore.isUserRegistered = isUserRegistered;
UserStore.isCredentialsCorrect = isCredentialsCorrect;
UserStore.getUserCtxFromEmail = getUserCtxFromEmail;

export default UserStore;
