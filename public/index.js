'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function calcPrices()
{
    for(var i = 0; i < events.length    ; i++)
    {
        events[i].price = calcPrice(events[i].barId, events[i].time, events[i].persons)
        events[i].commission.insurance = events[i].price * 0.3 / 2;
        events[i].commission.treasury = events[i].persons;
        events[i].commission.privateaser = events[i].price * 0.3 - (events[i].commission.insurance + events[i].commission.treasury);
        
        if(events[i].options.deductibleReduction)
        {
            events[i].commission.privateaser += events[i].persons;
            events[i].price += events[i].persons;
        }
    }
}

function calcPrice(id, time, persons){
    var price = 0;
    for(var i = 0; i < bars.length; i++)
        if(bars[i].id === id){
            if(persons > 10){
                if(persons > 20){
                    if(persons > 50)
                        price = time * bars[i].pricePerHour + (persons * bars[i].pricePerPerson)*0.5;
                    else
                        price = time * bars[i].pricePerHour + (persons * bars[i].pricePerPerson)*0.7;
                }
                else
                        price = time * bars[i].pricePerHour + (persons * bars[i].pricePerPerson)*0.9;
            }
            else
                price = time * bars[i].pricePerHour + (persons * bars[i].pricePerPerson);
                        
        }
        
    return price;
}

calcPrices();

function calcPayment()
{
    for(var actor of actors)
    {
        event = events.find(function(theevent){
            return theevent.id === actor.eventId;
        });
        var price = event.price;
        var insurance = event.commission.insurance;
        var treasury = event.commission.treasury;
        var privateaser = event.commission.privateaser;
        
        var commission = insurance + treasury + privateaser;
        
        for(var pay of actor.payment)
        {
            if(pay.who === "booker")
                pay.amount = price;
            if(pay.who === "bar")
                pay.amount = price - commission;
            if(pay.who === "insurance")
                pay.amount = insurance;
            if(pay.who === "treasury")
                pay.amount = treasury;
            if(pay.who === "privateaser")
                pay.amount = privateaser;
        }
    }
}

calcPayment();

console.log(bars);
console.log(events);
console.log(actors);
