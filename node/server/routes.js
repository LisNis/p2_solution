const {
    handleSignup,
    handleLogin,
    handleNewPost,
    handleLikePost,
    handleUnlikePost,
    handleDislikePost,
    handleUndislikePost,
    handleCommentOnPost,
    handlePinPost,
    handleUnpinPost,
    handleInvitation,
    handleDeclineInvitation,
    handleCreateTeam,
    handleNewEvent,
    handleAddNewMember,
    handleGetPosts,
    handleGetUsers,
    handleGetEvents,
    handleGetUserGroups,
    handleDeletePost,
    handleDeleteEvent
} = require('./controllers/');

function handleRoutes(req, res, parsedUrl) {
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'POST') {
        switch (pathname) {
            case '/signup':
                handleSignup(req, res);
                break;
            case '/login':
                handleLogin(req, res);
                break;
            case '/new-post':
                handleNewPost(req, res);
                break;
            case '/like-post':
                handleLikePost(req, res);
                break;
            case '/unlike-post':
                handleUnlikePost(req, res);
                break;
            case '/dislike-post':
                handleDislikePost(req, res);
                break;
            case '/undislike-post':
                handleUndislikePost(req, res);
                break;
            case '/comment-on-post':
                handleCommentOnPost(req, res);
                break;
            case '/pin-post':
                handlePinPost(req, res);
                break;
            case '/unpin-post':
                handleUnpinPost(req, res);
                break;
            case '/invitation':
                handleInvitation(req, res);
                break;
            case '/decline-invitation':
                handleDeclineInvitation(req, res);
                break;
            case '/create-team':
                handleCreateTeam(req, res);
                break;
            case '/new-event':
                handleNewEvent(req, res);
                break;
            case '/add-new-member':
                handleAddNewMember(req, res);
                break;
            case '/delete-post':
                handleDeletePost(req, res);
                break;
            case '/delete-event':
                handleDeleteEvent(req, res);
                break;
            default:
                res.writeHead(404);
                res.end('Not Found');
        }
    } else if (method === 'GET') {
        switch (pathname) {
            case '/get-posts':
                handleGetPosts(res);
                break;
            case '/get-users':
                handleGetUsers(res);
                break;
            case '/get-events':
                handleGetEvents(res);
                break;
            case '/get-user-groups':
                handleGetUserGroups(res);
                break;
            default:
                res.writeHead(404);
                res.end('Not Found');
        }
    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
}

module.exports = { handleRoutes };
