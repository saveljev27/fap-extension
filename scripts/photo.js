const producers = Array.from(document.querySelectorAll('.studio-row__studio'));

const getProducerHref = () => {
  const links = [];
  producers.forEach((studio) => {
    const link = studio.querySelector('a');
    if (link) {
      const producerHref = link.href;
      links.push(producerHref);
    }
  });

  return links;
};

const fetchComments = async () => {
  const promises = getProducerHref().map(async (url) => {
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

    return;
  });

  return Promise.all(promises);
};

const showComments = async () => {
  const internalComment = await fetchComments();

  producers.forEach((element, index) => {
    if (internalComment[index] !== null) {
      const producer = element.querySelector('a');
      producer.style.color = 'red';

      const comment = document.createElement('b');
      comment.classList.add('comment_popup');

      comment.textContent = `${internalComment[index]}` || 'N/A';

      producer.addEventListener('mouseover', () => {
        comment.style.display = 'block';
      });
      producer.addEventListener('mouseout', () => {
        comment.style.display = 'none';
      });
      producer.appendChild(comment);
    }
  });
};

if (producers.length) showComments();
