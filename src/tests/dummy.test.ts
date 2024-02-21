import { test, describe } from 'node:test';
import assert from 'node:assert';
import listHelper from '../utils/list_helper';

test('if dummy return one', () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  const listWithSingleBlog = [
    {
      title: 'Title1',
      author: 'Author1',
      url: 'https://page1.com',
      likes: 8,
      id: '65d5c3871e8789900106f0fd'
    }
  ];
  test('of list with single blog equals likes of this blog', () => {
    const result = listHelper.totalLikes(listWithSingleBlog);
    assert.strictEqual(result, 8);
  });

  const listWithManyBlogs = [
    {
      title: 'Title1',
      author: 'Author1',
      url: 'https://page1.com',
      likes: 8,
      id: '65d5c3871e8789900106f0fd'
    },
    {
      title: 'Title2',
      author: 'Author2',
      url: 'https://page2.com',
      likes: 17,
      id: '65d5c5182821c66e6399a3c8'
    },
    {
      title: 'Title3',
      author: 'Author3',
      url: 'https://page3.com',
      likes: 14,
      id: '65d5c51061548c0858dc0b11'
    },
    {
      title: 'Title4',
      author: 'Author4',
      url: 'https://page4.com',
      likes: 84,
      id: '65d5c50d1747f4092543782b'
    },
    {
      title: 'Title5',
      author: 'Author5',
      url: 'https://page5.com',
      likes: 112,
      id: '65d5c509ba98ef054d2b7b12'
    }
  ];
  test('of list with many blogs is the sum of likes of its blogs', () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    assert.strictEqual(result, 235);
  });
});