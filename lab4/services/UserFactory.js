// Factory pattern: creates user objects with role-specific defaults
class UserFactory {
  static create(type, data) {
    switch (type) {
      case 'admin':
        console.log('[UserFactory] Creating admin user');
        return {
          username: data.username,
          email: data.email,
          password: data.password,
          role: 'admin',
          createdAt: new Date(),
        };
      case 'user':
        console.log('[UserFactory] Creating regular user');
        return {
          username: data.username,
          email: data.email,
          password: data.password,
          role: 'user',
          createdAt: new Date(),
        };
      default:
        throw new Error(`[UserFactory] Unknown user type: "${type}"`);
    }
  }
}

module.exports = UserFactory;
