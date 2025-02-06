const performerData = () => {
  const producerBlock = document.querySelector('.col-md-5.scroll-div');
  if (!producerBlock) return null;

  const producerNickname = producerBlock.querySelector('a');
  if (!producerNickname) return null;

  const producerHref = producerNickname.href;
  return { producerNickname, producerHref };
};

const fetchComment = async () => {
  const data = performerData();
  if (!data) return null;
  const { producerHref } = data;
  const url = producerHref;

  const doc = await fetchData(url, 'fetchProducerComments');
  if (doc) {
    const getInternalComment = doc.getElementById(
      'producer-update-internal_comment'
    );
    const selectedComment = getInternalComment?.textContent.trim();
    return selectedComment && selectedComment.length > 0
      ? selectedComment
      : null;
  }
  return null;
};

const showComment = async () => {
  const data = performerData();
  if (!data) return;
  const { producerNickname } = data;
  const internalComment = await fetchComment();

  if (internalComment !== null && producerNickname !== null) {
    producerNickname.style.color = 'red';

    const comment = document.createElement('b');
    comment.classList.add('comment_popup');
    comment.textContent = internalComment || 'N/A';

    producerNickname.addEventListener('mouseover', () => {
      comment.style.display = 'block';
    });
    producerNickname.addEventListener('mouseout', () => {
      comment.style.display = 'none';
    });
    producerNickname.appendChild(comment);
  }
};

if (window.performerModeration) showComment();
