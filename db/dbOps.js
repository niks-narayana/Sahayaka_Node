var AWS = require('aws-sdk');
var T = require('./Ticket');

var PT = require('./PendingTicket');
var Tid = require('./TicketId');

var dynamo = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.S_K,
  secretAccessKey: process.env.S_S_K,
  region: process.env.REGION
})


module.exports.createTicket = (ticket, callback) => {
	//console.log("Before = " + ticket.name + ",ticketId = " + ticket.ticketId);

	T.TicketObj.Item = ticket;
	
    start(T.TicketObj, function(error, TicketObj){
      if (error) {
        console.log(error);
        callback(error, null);
      } else {
      	console.log('End!!! - ');
    	callback(null, TicketObj.Item);  	
      }
    });
    
}

start = function(TicketObj, mainCallback) { 
	var params = {
	  KeyConditionExpression: '#keyName = :keyName',
	  ExpressionAttributeNames: {
	      '#keyName': 'keyName'
	  },
	  ExpressionAttributeValues: {
	      ':keyName': 'niks_ticket_numbers'
	  },
	  ProjectionExpression: 'keyValue',
	  TableName: 'sahayaka_ticket_numbers'
	};

	dynamo.query(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	    mainCallback(error);
	  } else {
	  	var newId = 0;
	    data.Items.forEach(function(element, index, array) {
	      	console.log("Max Id = " + element.keyValue);
		    var maxId = element.keyValue;
			newId = (maxId + 1);
	    });
	    //console.log("New Id = " + newId);
	    Tid.TicketIdObj.Item.keyName = 'niks_ticket_numbers';
	    Tid.TicketIdObj.Item.keyValue = newId;
		
		TicketObj.Item.ticketId = newId; 
	
		updateTicketId(Tid.TicketIdObj, TicketObj, mainCallback);

		var pendingTicketIdVal = TicketObj.Item.pendingTicketId;
		console.log("going to delete pending ticket id = " + pendingTicketIdVal);
		if(pendingTicketIdVal && pendingTicketIdVal != 0)
			deletePendingTicket(pendingTicketIdVal);
		//console.log("After New Id = " + newId);
	  }
	});	
	
}

updateTicketId = function(TicketIdObj, TicketObj, mainCallback) {
		
	write(TicketIdObj, function(error, response){
      if (error) {
        console.log(error);
        mainCallback(error);
      } else {
    	//console.log('TICKET ID Saved!!! - ' + TicketObj);
      	addToTicketTable(TicketObj, mainCallback);
      	//console.log('After TICKET ID Saved!!! - ' + TicketObj);
      }
    });
}

module.exports.updateTicketTable = function(TicketObj, mainCallback) {
	T.TicketObj.Item = TicketObj;

  	write(T.TicketObj, function(error, response){
      if (error) {
        console.log(error);
        mainCallback(error);
      } else {
      	//console.log('Ticket Saved!!!');
      	mainCallback(TicketObj);
      }
    });

}

addToTicketTable = function(TicketObj, mainCallback) {
  	write(TicketObj, function(error, response){
      if (error) {
        console.log(error);
        mainCallback(error);
      } else {
      	//console.log('Ticket Saved!!!');
      	mainCallback(TicketObj);
      }
    });

}
	
write = function(tabledata, callback){
  	console.log('Going to write now..');
  	
	dynamo.put(tabledata, function(error, data){
	  if (error) {
	    callback(error, null);
	  }else{
	   	callback(null, data);
	  }
	});
};

deletePendingTicket = (pendingTicketId) => {
	 console.log("deleting from pending ticket id = " + pendingTicketId);
	 var params = {
	  "Key": {
	   "pendingTicketId": pendingTicketId
	  }, 
	  TableName: "Pending_Tickets_Nik"
	 };
	 dynamo.delete(params, function(err, data) {
	   if (err) console.log(err, err.stack); // an error occurred
	   else     console.log(data);           // successful response
	 });
}

module.exports.getPhoneNumberDetails = function(request, phoneNumberCallback) {
	var phoneNumber = request.body.phoneNumber;
	console.log("Number = " + phoneNumber);
	var params = {
	  ExpressionAttributeNames: {
        "#ticketId": "ticketId",
        "#name": "name",
        "#phoneNumber": "phoneNumber",
        "#aadharNumber": "aadharNumber",
        "#distName": "distName",
        "#talukName": "talukName",
        "#villageName": "villageName",
        "#category": "category",
        "#priority": "priority",
        "#details": "details",
        "#userId": "userId",
        "#status": "status",
        "#creationDateTime": "creationDateTime",
        "#userPhoneNumber":"userPhoneNumber",
        "#postponedDateTime":"postponedDateTime",
        "#resolvedDateTime":"resolvedDateTime",
        "#notes":"notes",
        "#photoUrl":"photoUrl",
        "#pendingTicketId":"pendingTicketId"
	  }, 
	  ExpressionAttributeValues: {
	    ":phoneNumber": phoneNumber
	  },
	  FilterExpression: "#phoneNumber = :phoneNumber", 
	  ProjectionExpression: 
        "#ticketId,#name,#phoneNumber,#aadharNumber,#distName,#talukName,#villageName,#category,#priority,#details," + 
        "#userId,#status,#creationDateTime,#userPhoneNumber,#postponedDateTime,#resolvedDateTime,#notes,#photoUrl," + 
        "#pendingTicketId",
	  TableName: "Tickets_Nik"
	 };

	dynamo.scan(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err,
	                null, 2));
	        phoneNumberCallback(err, null);
	    } else {
	        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
	        
	        console.log("ITems Details = " + JSON.stringify(data.Items[0], null, 2));
	        if(data.Items.length > 0) {
	        	phoneNumberCallback(null, data.Items[0]);
				return;
		    } else {
		    	phoneNumberCallback(null, null);
		    }
	    }
	});

}

module.exports.getAllOpenTickets = function(openTicketCallBack) {
	var status = 'OPEN';
	var params = {
	  ExpressionAttributeNames: {
        "#ticketId": "ticketId",
        "#name": "name",
        "#phoneNumber": "phoneNumber",
        "#aadharNumber": "aadharNumber",
        "#distName": "distName",
        "#talukName": "talukName",
        "#villageName": "villageName",
        "#category": "category",
        "#priority": "priority",
        "#details": "details",
        "#userId": "userId",
        "#status": "status",
        "#creationDateTime": "creationDateTime",
        "#userPhoneNumber":"userPhoneNumber",
        "#postponedDateTime":"postponedDateTime",
        "#resolvedDateTime":"resolvedDateTime",
        "#notes":"notes",
        "#photoUrl":"photoUrl",
        "#pendingTicketId":"pendingTicketId"
	  },
	  ExpressionAttributeValues: {
	    ":status": "OPEN"
	  },
	  FilterExpression: "#status = :status", 
	  ProjectionExpression: 
        "#ticketId,#name,#phoneNumber,#aadharNumber,#distName,#talukName,#villageName,#category,#priority,#details," + 
        "#userId,#status,#creationDateTime,#userPhoneNumber,#postponedDateTime,#resolvedDateTime,#notes,#photoUrl," + 
        "#pendingTicketId",
	  TableName: "Tickets_Nik"
	 };

	dynamo.scan(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err,
	                null, 2));
	        openTicketCallBack(err, null);
	    } else {
	        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));        
    		openTicketCallBack(null, data.Items);
	    }
	    return;
	});
}

module.exports.getAllTickets = function(allTicketCallBack) {
	var params = {
	  ExpressionAttributeNames: {
        "#ticketId": "ticketId",
        "#name": "name",
        "#phoneNumber": "phoneNumber",
        "#aadharNumber": "aadharNumber",
        "#distName": "distName",
        "#talukName": "talukName",
        "#villageName": "villageName",
        "#category": "category",
        "#priority": "priority",
        "#details": "details",
        "#userId": "userId",
        "#status": "status",
        "#creationDateTime": "creationDateTime",
        "#userPhoneNumber":"userPhoneNumber",
        "#postponedDateTime":"postponedDateTime",
        "#resolvedDateTime":"resolvedDateTime",
        "#notes":"notes",
        "#photoUrl":"photoUrl",
        "#pendingTicketId":"pendingTicketId"
	  },
	  ProjectionExpression: 
        "#ticketId,#name,#phoneNumber,#aadharNumber,#distName,#talukName,#villageName,#category,#priority,#details," + 
        "#userId,#status,#creationDateTime,#userPhoneNumber,#postponedDateTime,#resolvedDateTime,#notes,#photoUrl," + 
        "#pendingTicketId",
	  TableName: "Tickets_Nik"
	 };

	dynamo.scan(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err,
	                null, 2));
	        allTicketCallBack(err, null);
	    } else {
	        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));        
    		allTicketCallBack(null, data.Items);
	    }
	});
}

module.exports.createPendingTicket = (pendingTicket, pendingTicketCallBack) => {
	PT.TicketObj.Item = pendingTicket;

	var params = {
	  KeyConditionExpression: '#keyName = :keyName',
	  ExpressionAttributeNames: {
	      '#keyName': 'keyName'
	  },
	  ExpressionAttributeValues: {
	      ':keyName': 'niks_pending_ticket_number'
	  },
	  ProjectionExpression: 'keyValue',
	  TableName: 'sahayaka_ticket_numbers'
	};

	dynamo.query(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	    mainCallback(error);
	  } else {
	  	var newId = 0;
	    if(data.Items.length > 0) {
	      	console.log("Max Id = " + data.Items[0].keyValue);
		    var maxId = data.Items[0].keyValue;
			newId = (maxId + 1);
	    }
	    
	    Tid.TicketIdObj.Item.keyName = 'niks_pending_ticket_number';
	    Tid.TicketIdObj.Item.keyValue = newId;
		
		PT.TicketObj.Item.pendingTicketId = newId; 
	
	    //console.log("New Id = " + newId);
		updateTicketId(Tid.TicketIdObj, PT.TicketObj, pendingTicketCallBack);
		//console.log("After New Id = " + newId);
	  }
	});	
	
}


module.exports.getPendingTickets = function(pendingTicketCallBack) {
	var params = {
	  ExpressionAttributeNames: {
        "#pendingTicketId": "pendingTicketId",
        "#phoneNumber": "phoneNumber",
        "#recordingName": "recordingName"
	  },
	  ProjectionExpression: 
        "#pendingTicketId,#phoneNumber,#recordingName",
	  TableName: "Pending_Tickets_Nik"
	 };

	dynamo.scan(params, function(err, data) {
	    if (err) {
	        console.error("Unable to read item. Error JSON:", JSON.stringify(err,
	                null, 2));
	        pendingTicketCallBack(err, null);
	    } else {
	        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));        
    		pendingTicketCallBack(null, data.Items);
	    }
	});
}