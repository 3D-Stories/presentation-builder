# FitLoop — product vision doc (WIP)

## What it is

FitLoop is a consumer fitness app that uses your phone's camera to give real-time
form feedback on 40 common strength-training exercises. It runs on-device (no
video ever leaves the phone). The coach feedback is text + a subtle audio cue —
you don't have to look at the screen mid-rep.

## Who it's for

Adults 25–45 who lift at home or in a commercial gym 3-5x/week. They know *what*
to do but aren't sure they're doing it right. They don't want a trainer ($$) and
they've found YouTube form-check subreddits inadequate (async, you have to film
yourself, wait a day, maybe get a useful reply).

## Early signal

- 9 weeks in beta (closed, TestFlight)
- 340 active users
- 72% week-4 retention
- Median session length: 38 min
- NPS 61
- Top unsolicited feedback phrase: "it caught the thing my trainer missed"

## Why now

- On-device pose estimation got good enough in 2025 (MediaPipe Pose v3, Apple's
  `ARBodyTrackingConfiguration` on A17+).
- Post-Ozempic-era gym returners are re-learning basics and want low-embarrassment
  feedback.
- Garmin/Whoop have made "data-informed fitness" a default consumer expectation
  but neither does real-time form.

## What we still don't have words for

- Our monetization model — subscription? freemium? we're still testing.
- Our expansion from strength into mobility/yoga/cardio. It should happen but I
  don't have a clean story yet.
- Our "moat" beyond the on-device ML. Founding team cares about this more than
  most VCs do, I think.
