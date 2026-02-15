let date_text = document.getElementById("date_text")
let day_input = document.getElementById("day_input")
let corr_incorr_text = document.getElementById("correct_incorrect_text")
let start_button = document.getElementById("start_button")
let streak_text = document.getElementById("streak_text")
let all_time_text = document.getElementById("all_time_text")

let started = false

window.onload = start
start_button.addEventListener("click", start_button_clicked)
day_input.addEventListener("keyup", dotw_inputted)

function day_of_the_week(date) {
  if (date == "N/A") {
    return NaN
  }

  let doomsdays = {
    1: [3, 4],
    2: [28, 29],
    3: [14],
    4: [4],
    5: [9],
    6: [6],
    7: [11],
    8: [8],
    9: [5],
    10: [10],
    11: [7],
    12: [12]
  }

  let days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
  }

  const divmod = (x, y) => [Math.floor(x / y), x % y];

  let date_array = date.split("-");
  let century_anchors = [2, 0, 5, 3];
  let century_anchor = century_anchors[(date_array[2].slice(0, -2) % 4)];
  let century_number = date_array[2].slice(-2);
  let century_number_divmod = divmod(century_number, 12)
  let remainder_div_4 = Math.floor(century_number_divmod[1] / 4)
  let addition_result = century_anchor + century_number_divmod[0] + century_number_divmod[1] + remainder_div_4
  let doomsday_dotw = addition_result % 7
  let doomsday_date = doomsdays[parseInt(date_array[1])]
  let closest_doomsday = 0
  if (date_array[2] % 4 == 0 && doomsday_date[1]) {
    closest_doomsday = doomsday_date[1]
  } else {
    closest_doomsday = doomsday_date[0]
  }

  let current_date = closest_doomsday
  while (current_date != parseInt(date_array[0])) {
    if (current_date > date_array[0]) {
      current_date -= 1
      doomsday_dotw -= 1
      if (doomsday_dotw < 0) {
        doomsday_dotw = 6
      }
    } else {
      current_date += 1
      doomsday_dotw += 1
      if (doomsday_dotw > 6) {
        doomsday_dotw = 0
      }
    }
  }

  return days[doomsday_dotw]
}

function randomDate(date1, date2) {
    function randomValueBetween(min, max) {
      return Math.random() * (max - min + 1) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if (date1>date2) {
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()
    } else {
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()
    }
}

function save_alltime_score(score) {
  localStorage.setItem("all_time_score", score)
}

function load_alltime_score() {
  let alltime_score = localStorage.getItem("all_time_score")
  return alltime_score ? parseInt(alltime_score) : 0
}

function start() {
  let min_date = document.getElementById("min_date")
  let max_date = document.getElementById("max_date")

  min_date.value = "2026-02-13"
  max_date.value = "2026-02-15"

  let alltime_score = load_alltime_score()
  all_time_text.innerHTML = "All-time: " + alltime_score
}

function generate_date() {
  let min_date = document.getElementById("min_date")
  let max_date = document.getElementById("max_date")
  started = true

  let minimum_date_string = min_date.value;
  let maximum_date_string = max_date.value;

  let random_date = randomDate(minimum_date_string, maximum_date_string).split("/").join("-")
  date_text.innerHTML = random_date
  console.log(random_date)
  day_of_the_week(random_date)
}

function start_button_clicked() {
    if (started) {
      return
    }

    generate_date()
}

let feedbackTimeout;

function dotw_inputted(event) {
  if (event.key !== "Enter") {
    return
  }

  clearTimeout(feedbackTimeout)

  let correct_day = day_of_the_week(date_text.innerHTML)
  if (!correct_day) {
    return
  }

  if (day_input.value.toLowerCase() === correct_day.toLowerCase()) {
    console.log("Correct!")
    corr_incorr_text.innerHTML = "Correct!"
    corr_incorr_text.style.color = "#03fc3d"
    let currentStreak = streak_text.innerHTML.match(/\d+\.?\d*/g)?.map(Number)
    let all_time = all_time_text.innerHTML.match(/\d+\.?\d*/g)?.map(Number)
    streak_text.innerHTML = "Streak: " + (parseInt(currentStreak[0]) + 1)
    all_time_text.innerHTML = "All-time: " + (parseInt(all_time[0]) + 1)
    save_alltime_score(parseInt(all_time[0]) + 1)
  } else {
    console.log("Incorrect")
    corr_incorr_text.innerHTML = "Incorrect! It's " + correct_day
    corr_incorr_text.style.color = "#fc0307"
    streak_text.innerHTML = "Streak: 0"
  }

  feedbackTimeout = setTimeout(function() {
    corr_incorr_text.style.color = "#ffffff"
    corr_incorr_text.innerHTML = "-"
  }, 1500)

  generate_date()
  day_input.value = ""
}
