const strings = {
  title: "Global Frog Rescue",
  donation:
    "This month, we have received ${amount, number, currency} in donations. <i>Thank you</i>.",
  top: "Our most popular frogs this month are frog numbers {0, number}, {1, number} and {2, number}.",
  leaderboard:
    "As of {today, date}, your sponsored frog {frogId, number} is ranked {rank, ordinal} on the leaderboard with <b>{points, number} votes</b>!",
  greeting:
    "Hello {otherName}, My name is {myName} and it's nice to meet you. We first met on {meetingDate, date, short}",
  tagged: "<b>View your frog at <a>{siteUrl}</a></b>",
  plural:
    "Your frog has {nVotes, plural, =0 {no votes, <i>(sorry)</i>} =1 {# vote} other {# votes <i>(that's {increase, number} more than {lastWeek, date}!)</i>}}",
  dates: "Our next volunteering dates are {0, date}, {1, date} and {2, date}",
} as const;

type Strings = typeof strings;
type I18nMessageKey = keyof Strings;

const f = <T extends keyof typeof strings>(
  ...args: {} extends I18nMessageParameters<(typeof strings)[T]>
    ? [T]
    : [T, I18nMessageParameters<(typeof strings)[T]>]
) => {};

type I18nMessageParametersExample = I18nMessageParameters<
  (typeof strings)["plural"]
>;

f("leaderboard", {
  rank: 1,
  frogId: 103,
  points: 4,
  today: new Date(),
  b: (x) => `**${x}**`,
});

const datesMessage = f("dates", [new Date(), new Date(), new Date()]);

const badMessage = f("title", {});

type un = { a: string } & { a: string; b: string };
type me = {
  [k in keyof un]: un[k];
};

// 1. Basic arg

type JSXELEMENT = "";

type Args =
  I18nMessageParameters<"You liked {n, plural, 0 {no notifications} =1 {# notification} other {# notifications}}">;
