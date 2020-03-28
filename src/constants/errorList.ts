export default {
  NOT_VALID: {
    code: 1,
    info: 'data not valid. Check by validator',
  },
  NOT_AUTHORIZED: {
    code: 6,
    info: 'Not authorized',
  },
  BAN: {
    FOUND_REMOVED: {
      code: 2,
      info: 'info about this restricted was deleted',
    },
    VOTE_EXIST: {
      code: 8,
      info: 'vote exist',
    },
  },
  USER: {
    NOT_FOUND: {
      code: 3,
      info: 'User not found',
    },
    WRONG_PASSWORD: {
      code: 4,
      info: 'Wrong password',
    },
    TOKEN_ERROR: {
      code: 5,
      info: 'Error check token',
    },
  },
  BOT: {
    TOKEN_ERROR: {
      code: 7,
      info: 'Error check token',
    },
  },
};
