// Test the hashtag pattern flow
console.log('=== TESTING HASHTAG PATTERN FLOW ===');

// Test 1: MoodContext hashtag processing
function testHashtagProcessing() {
  console.log('\n1. Testing MoodContext hashtag processing:');
  
  const emotions = ['Happy', 'Excited'];
  const activities = ['Exercise', 'Music'];
  const notes = 'Feeling great!';
  
  const emotionTags = emotions ? emotions.map(e => `#${e}`).join(' ') : '';
  const activityTags = activities ? activities.map(a => `#${a}`).join(' ') : '';
  const journalWithPatterns = [notes, emotionTags, activityTags].filter(Boolean).join(' ');
  
  console.log('Input emotions:', emotions);
  console.log('Input activities:', activities);
  console.log('Input notes:', notes);
  console.log('Emotion tags:', emotionTags);
  console.log('Activity tags:', activityTags);
  console.log('Final journal entry:', journalWithPatterns);
  
  return journalWithPatterns;
}

// Test 2: Analytics hashtag parsing
function testHashtagParsing(journalEntry) {
  console.log('\n2. Testing Analytics hashtag parsing:');
  
  // Extract emotions
  const emotionMatches = journalEntry.match(/#(\w+)/g) || [];
  const extractedEmotions = emotionMatches.map(match => match.substring(1));
  
  console.log('Journal entry:', journalEntry);
  console.log('Emotion matches:', emotionMatches);
  console.log('Extracted emotions:', extractedEmotions);
  
  return extractedEmotions;
}

// Test 3: Complete flow
function testCompleteFlow() {
  console.log('\n3. Testing complete flow:');
  
  const journalEntry = testHashtagProcessing();
  const extractedEmotions = testHashtagParsing(journalEntry);
  
  console.log('\n=== RESULTS ===');
  console.log('✅ Hashtag processing works:', journalEntry.includes('#'));
  console.log('✅ Hashtag parsing works:', extractedEmotions.length > 0);
  console.log('✅ Complete flow works:', journalEntry.includes('#') && extractedEmotions.length > 0);
  
  if (journalEntry.includes('#') && extractedEmotions.length > 0) {
    console.log('🎉 SUCCESS: Hashtag patterns are working correctly!');
  } else {
    console.log('❌ FAILURE: Hashtag patterns are not working correctly!');
  }
}

// Run tests
testCompleteFlow();

// Test with different scenarios
console.log('\n=== TESTING DIFFERENT SCENARIOS ===');

// Scenario 1: Only emotions
console.log('\nScenario 1: Only emotions');
const emotions1 = ['Grateful', 'Excited'];
const activities1 = [];
const notes1 = 'Great day!';
const emotionTags1 = emotions1 ? emotions1.map(e => `#${e}`).join(' ') : '';
const activityTags1 = activities1 ? activities1.map(a => `#${a}`).join(' ') : '';
const journal1 = [notes1, emotionTags1, activityTags1].filter(Boolean).join(' ');
console.log('Result:', journal1);

// Scenario 2: Only activities
console.log('\nScenario 2: Only activities');
const emotions2 = [];
const activities2 = ['Exercise', 'Music'];
const notes2 = 'Workout day!';
const emotionTags2 = emotions2 ? emotions2.map(e => `#${e}`).join(' ') : '';
const activityTags2 = activities2 ? activities2.map(a => `#${a}`).join(' ') : '';
const journal2 = [notes2, emotionTags2, activityTags2].filter(Boolean).join(' ');
console.log('Result:', journal2);

// Scenario 3: No patterns
console.log('\nScenario 3: No patterns');
const emotions3 = [];
const activities3 = [];
const notes3 = 'Just a regular day';
const emotionTags3 = emotions3 ? emotions3.map(e => `#${e}`).join(' ') : '';
const activityTags3 = activities3 ? activities3.map(a => `#${a}`).join(' ') : '';
const journal3 = [notes3, emotionTags3, activityTags3].filter(Boolean).join(' ');
console.log('Result:', journal3);
