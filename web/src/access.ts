/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const nothing = {
    c: currentUser
  }
  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    canAdmin: nothing && true,
  };
}
