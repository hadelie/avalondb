var avGenre = {
  0: '전략',
  1: '추상',
  2: '컬렉터블',
  3: '가족',
  4: '어린이',
  5: '파티',
  6: '테마',
  7: '전쟁',
  8: '한글',
  9: '기타',
  'all': 'All'
}

for (var i=0; i<10; i++)
  $('#opt_search_by_genre').append('<li value=\"'+i+'\" onclick=\"searchByGenre('+i+')\"><a>'+avGenre[i]+'</a></li>');

//  $('#opt_search_by_genre').append('<option value=\"'+i+'\">'+avGenre[i]+'</option>');
