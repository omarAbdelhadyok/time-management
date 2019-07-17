import { Component, OnInit } from '@angular/core';
import { FavColorsService } from 'src/app/shared/services/fav-colors.service';
import { FavColor } from 'src/app/shared/models/fav-color.model';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import tinycolor from "tinycolor2";
import * as uuidv1 from 'uuid/v1.js';

@Component({
  selector: 'app-fav-colors',
  templateUrl: './fav-colors.component.html',
  styleUrls: ['./fav-colors.component.scss']
})
export class FavColorsComponent implements OnInit {

  favColors: FavColor;
  busyLoading: boolean = false;
  busySaving: boolean = false;
  user: User;

  constructor(private favColorsService: FavColorsService,
    private toastr: ToastrService,
    private authService: AuthService) {
      this.authService.user$.subscribe(res => this.user = res);
    }

  ngOnInit() {
    this.getAllColors();
  }

  getAllColors() {
    this.busyLoading = true;
    try {
      this.favColorsService.getAll().then(snapshot => {
        let results = [];
        snapshot.docs.map(doc => {
          const data = doc.data() as FavColor;
          const id = doc.id;
          results.push({ id, ...data });
        })
        if(results.length !== 0) {
          this.favColors = results[0];
        } else {
          this.favColors = new FavColor();
        }
        this.busyLoading = false;
      })
      .catch(err => {
        this.toastr.error('Somthing Went Wrong, Please reload the page');
        this.busyLoading = false;
      })
    } catch (error) {
        this.toastr.error('Somthing Went Wrong, Please reload the page');
        this.busyLoading = false;
    }
  }

  updateColors() {
    for(let color of this.favColors.colors) {
      if(!tinycolor(color).isValid())
      return this.toastr.error('Please type a valid color (ex. #FF0000)');
      color = '#'+tinycolor(color).toHex();
    }
    if(!this.favColors.uid) this.favColors.uid = this.user.uid;
    if(!this.favColors.id) this.favColors.id = uuidv1();
    this.busySaving = true;
    try {
      this.favColorsService.create(this.favColors.id, this.favColors).then(res => {
        this.busySaving = false;
        this.toastr.success('Your favorite colors were successfully updated');
      })
      .catch(err => {
        this.busySaving = false;
        this.toastr.error('Somthing Went Wrong, Please try again');
      })
    } catch (error) {
        this.busySaving = false;
      this.toastr.error('Somthing Went Wrong, Please try again');
    }
  }

}
