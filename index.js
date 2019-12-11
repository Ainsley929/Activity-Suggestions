const Alexa = require('ask-sdk-core')
const axios = require('axios')
const skillBuilder = Alexa.SkillBuilders.custom()

async function getSuggestion() {
    const response = await axios.get(`http://www.boredapi.com/api/activity/`)
    return response.data.activity
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {


        return handlerInput.responseBuilder
            .speak('Are you looking for something to do')
            .reprompt('Hello')
            .withShouldEndSession(false)
            .getResponse()
    },
}
const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },

    async handle(handlerInput) {
        const activity = await getSuggestion()
        const reprompt = `<p>Would you like another suggestion?</p>`

        return handlerInput.responseBuilder
            .speak(activity + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    },
    handle(handlerInput) {
        const speechText = 'Hope you got some good ideas, bye!'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse()
    },
}
const ActivityIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ActivityIntent'
    },
    async handle(handlerInput) {
        const activity = await getSuggestion()
        const reprompt = `<s>Would you like another suggestion?</s>`

        return handlerInput.responseBuilder
            .speak(activity + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}

const CancelAndStopIntenthandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('goodbye')
            .withShouldEndSession(true)
            .getResponse()
    },
}
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        const guidance = 'We can provide suggestions for things to do!'
        const reprompt = 'Would you like a suggestion?'

        return handlerInput.responseBuilder
            .speak(guidance + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const FallBackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallBackIntent'
    },
    handle(handlerInput) {
        const guidance = 'Im sorry, I didnt understand that'
        const reprompt = 'Would you like another suggestion?'

        return handlerInput.responseBuilder
            .speak(guidance + reprompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Have Fun!')
            .withShouldEndSession(true)
            .getResponse()
    },
}
const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I'm sorry I didn't catch that. Can you repeat that?")
            .reprompt("I'm sorry I didn't catch that. Can you repeat that?")
            .withShouldEndSession(false)
            .getResponse()
    },
}



exports.handler = skillBuilder
    .addRequestHandlers(
        ActivityIntentHandler,
        FallBackIntentHandler,
        CancelAndStopIntenthandler,
        HelpIntentHandler,
        LaunchRequestHandler,
        YesIntentHandler,
        SessionEndedRequestHandler,
        NoIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda()
