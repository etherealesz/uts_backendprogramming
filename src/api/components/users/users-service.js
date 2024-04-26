  const usersRepository = require('./users-repository');
  const { hashPassword, passwordMatched } = require('../../../utils/password');

  /**
   * Get list of users
   * @returns {Array}
   */
  async function getUsers(
    pageNumber = 1,
    pageSize,
    searchField = '',
    searchV = '',
    sortField = '',
    sortOrder = 'asc'
  ) {
    let users = await usersRepository.getUsers();
    if(searchField && searchV){    
      switch (searchField) {
      case 'email':
        users = users.filter((user) =>
          user.email.toLowerCase().includes(searchV.toLowerCase())
        );
        break;
      case 'name':
        users = users.filter((user) => 
        user.name.toLowerCase().includes(searchV.toLowerCase()));
        break;
    }
    }
    if (sortField && sortOrder) {
    switch (sortField) {
      case 'email':
        if (sortOrder === 'desc') {
          users = users.sort((a, b) => a.email.localeCompare(b.email)).reverse();
        } else {
          users = users.sort((a, b) => a.email.localeCompare(b.email));
        }
        break;
      case 'id':
        if (sortOrder === 'desc') {
          users = users.sort((a, b) => a.id.localeCompare(b.id)).reverse();
        } else {
          users = users.sort((a, b) => a.id.localeCompare(b.id));
        }
        break;
      case 'name':
        if (sortOrder === 'desc') {
          users = users.sort((a, b) => a.name.localeCompare(b.name)).reverse();
        } else {
          users = users.sort((a, b) => a.name.localeCompare(b.name));
        }
        break;
    }
    }

    const totalItems = users.length;
    const totalPages = pageSize ? Math.ceil(totalItems / pageSize) : 1;
    const startIndex = (pageNumber - 1) * (pageSize || totalItems);
    const endIndex = Math.min(startIndex + (pageSize || totalItems), totalItems);


    const paginatedUsers = users.slice(startIndex, endIndex);

    const results = paginatedUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    return {
      page_number: pageNumber,
      page_size: pageSize || totalItems,
      count: paginatedUsers.length,
      total_pages: totalPages,
      has_previous_page: pageNumber > 1,
      has_next_page: pageNumber < totalPages,
      data: results,
    };
  }

  /**
   * Get user detail
   * @param {string} id - User ID
   * @returns {Object}
   */
  async function getUser(id) {
    const user = await usersRepository.getUser(id);

    // User not found
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  /**
   * Create new user
   * @param {string} name - Name
   * @param {string} email - Email
   * @param {string} password - Password
   * @returns {boolean}
   */
  async function createUser(name, email, password) {
    // Hash password
    const hashedPassword = await hashPassword(password);

    try {
      await usersRepository.createUser(name, email, hashedPassword);
    } catch (err) {
      return null;
    }

    return true;
  }

  /**
   * Update existing user
   * @param {string} id - User ID
   * @param {string} name - Name
   * @param {string} email - Email
   * @returns {boolean}
   */
  async function updateUser(id, name, email) {
    const user = await usersRepository.getUser(id);

    // User not found
    if (!user) {
      return null;
    }

    try {
      await usersRepository.updateUser(id, name, email);
    } catch (err) {
      return null;
    }

    return true;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {boolean}
   */
  async function deleteUser(id) {
    const user = await usersRepository.getUser(id);

    // User not found
    if (!user) {
      return null;
    }

    try {
      await usersRepository.deleteUser(id);
    } catch (err) {
      return null;
    }

    return true;
  }

  /**
   * Check whether the email is registered
   * @param {string} email - Email
   * @returns {boolean}
   */
  async function emailIsRegistered(email) {
    const user = await usersRepository.getUserByEmail(email);

    if (user) {
      return true;
    }

    return false;
  }

  /**
   * Check whether the password is correct
   * @param {string} userId - User ID
   * @param {string} password - Password
   * @returns {boolean}
   */
  async function checkPassword(userId, password) {
    const user = await usersRepository.getUser(userId);
    return passwordMatched(password, user.password);
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} password - Password
   * @returns {boolean}
   */
  async function changePassword(userId, password) {
    const user = await usersRepository.getUser(userId);

    // Check if user not found
    if (!user) {
      return null;
    }

    const hashedPassword = await hashPassword(password);

    const changeSuccess = await usersRepository.changePassword(
      userId,
      hashedPassword
    );

    if (!changeSuccess) {
      return null;
    }

    return true;
  }

  module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    emailIsRegistered,
    checkPassword,
    changePassword,
  };
