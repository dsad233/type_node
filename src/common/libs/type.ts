/**
 * Auth
 */

// 토큰 타입
export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

// prefix type
export enum PrefixType {
  USERS = 'USERS',
  POSTS = 'POSTS',
}

/**
 * Posts
 */
export enum OrderBy {
  NEW = 'NEW',
  POPULAR = 'POPULAR',
  COMMENTS = 'COMMENTS',
  VIEWS = 'VIEWS',
}
