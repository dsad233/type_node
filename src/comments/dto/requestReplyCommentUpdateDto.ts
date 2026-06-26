import { BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export type TRequestReplyCommentUpdateDto = {
  id: string;
  commentId: string;
  replyId: string;
};

export async function RequestReplyCommentUpdateDto({
  id,
  commentId,
  replyId,
}: TRequestReplyCommentUpdateDto): Promise<TRequestReplyCommentUpdateDto> {
  if (!id) {
    throw new BadRequest('게시글 ID가 존재하지 않습니다. 다시 시도 해주세요.');
  }

  if (!commentId) {
    throw new BadRequest('댓글 ID가 존재하지 않습니다. 다시 시도 해주세요.');
  }

  if (!replyId) {
    throw new BadRequest('대댓글 ID가 존재하지 않습니다. 다시 시도 해주세요.');
  }

  if (!id.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 게시글 ID 형식입니다.');
  }

  if (!commentId.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 댓글 ID 형식입니다.');
  }

  if (!replyId.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 대댓글 ID 형식입니다.');
  }

  return {
    id: id.trim(),
    commentId: commentId.trim(),
    replyId: replyId.trim(),
  };
}
