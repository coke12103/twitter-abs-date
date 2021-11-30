// ==UserScript==
// @name         Twitter Absolute Date
// @namespace    https://github.com/coke12103/
// @version      0.0.1
// @description  Twitter absolute date
// @author       coke12103
// @include      https://twitter.com/*
// @include      http://twitter.com/*
// @grant        none
// @license      CC0
// ==/UserScript==

// settings
//   当日なら時間だけの表示するか
const use_smart_absolute_date = true;

// date = Date
function is_today(date){
  if(!use_smart_absolute_date) return false;

  const now = new Date();

  const date_zero = new Date(date.toDateString()).getTime();
  const now_zero = new Date(now.toDateString()).getTime();

  return date_zero == now_zero;
}

// date = Date
function parse_date(date, force_full_date = false){
  const abs_date = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
  const abs_time = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;

  return (force_full_date || !is_today(date)) ? `${abs_date} ${abs_time}` : abs_time;
}

function callback(mutations){
  for(const mutation of mutations){
    const target_elements = mutation.target.querySelectorAll('[role="article"]');

    for(const element of target_elements){
      const times = element.querySelectorAll('time[datetime]');

      for(const time of times) time.innerText = parse_date(new Date(time.getAttribute('datetime')));

      const post_page_time = element.querySelector('[dir="auto"]:not([id]) a[role="link"] > span');

      if(!!post_page_time) post_page_time.innerText = parse_date(new Date(post_page_time.innerText.replace('·', '')), true);
    }
  }
}

const obs_target = document.querySelector("[id='react-root']");
const obs_opt = {
  childList: true,
  attributes: true,
  subtree: true
}

const observer = new MutationObserver(callback);

observer.observe(obs_target, obs_opt);
