from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync 
import app.website.actions as actions  


class BlogConsumer(JsonWebsocketConsumer):
	root_name = "broadcast"

	def connect(self):
		"""Event when client connects"""
		# Accept the connection 
		self.accept()
		# Assign the Broadcast group 
		async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)


	def disconnect(self, close_code):
		"""Event when clients disconnect"""
		pass 


	def receive_json(self, data_received):
		"""
			Event when data is received 
			All information will arive in 2 variables
			"action", with the action to be taken
			"data" with the information
		"""
		# Get the data 
		data = data_received["data"]
		# Depending on the action, we will do one task or another.
		match data_received["data"]:
			case "Change page":
				actions.send_page(self, data)
			case "Add next posts":
				actins.add_next_posts(self, data)

	def send_html(self, event):
		"""Event: Send html to client"""
		data = {
			"selector": event["selector"],
			"html": event["html"],
			"append": "append" in event and event["append"],
			"broadcast": event["broadcast"] if "broadcast" in event else False,
			"url": event["url"] if "url" in event else "",
		}

		self.send_json(data)
