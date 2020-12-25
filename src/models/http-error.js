/**
 * Create a Error with message and status (e.g. 404)
 */
class HttpError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} status
   */
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

module.exports = HttpError
