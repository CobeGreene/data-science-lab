import { Component, OnInit } from '@angular/core';
import { Notification } from '../../models';
import { NotificationService } from '../../services/notification-service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(
    public notification: Notification,
    private service: NotificationService
  ) { }

  ngOnInit() {
  }

  onExit(_: MouseEvent) {
    this.service.pop();
  }

}
