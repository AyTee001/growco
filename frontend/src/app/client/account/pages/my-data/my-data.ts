import { AsyncPipe } from '@angular/common';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile, UserProfileService } from '../../../../core/user-profile.service';
import { AccountCardComponent } from '../../../../shared/account-card/account-card';
import { InfoRowActionType, InfoRowComponent } from '../../../../shared/info-row/info-row';
import { EditProfileFieldDialog, EditProfileFieldDialogData } from './edit-profile-field-dialog';

@Component({
  selector: 'app-my-data-page',
  standalone: true,
  imports: [AsyncPipe, AccountCardComponent, InfoRowComponent],
  templateUrl: './my-data.html',
  styleUrl: './my-data.scss'
})
export class MyDataPage implements OnInit {
  private readonly profileService = inject(UserProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly ngZone = inject(NgZone);

  readonly profile$ = this.profileService.profile$;

  ngOnInit(): void {
    this.profileService.syncEmailFromToken();
  }

  actionTypeForPersonalName(p: UserProfile): InfoRowActionType {
    return !p.fullName?.trim() ? 'plus' : 'pencil';
  }

  actionTypeForBirth(p: UserProfile): InfoRowActionType {
    return !p.birthDate?.trim() ? 'plus' : 'pencil';
  }

  actionTypeForEmail(p: UserProfile): InfoRowActionType {
    return !p.email?.trim() ? 'plus' : 'pencil';
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.ngZone.run(() => this.profileService.setAvatarDataUrl(result));
      }
    };
    reader.readAsDataURL(file);
  }

  openFullName(): void {
    const snap = this.profileService.getProfileSnapshot();
    this.openFieldDialog({
      title: 'Прізвище та ім’я',
      fieldLabel: 'Прізвище та ім’я',
      initialValue: snap.fullName ?? '',
      mode: 'text'
    }).subscribe((v) => {
      if (v !== undefined) this.profileService.patchProfile({ fullName: v.trim() });
    });
  }

  openBirthDate(): void {
    const snap = this.profileService.getProfileSnapshot();
    this.openFieldDialog({
      title: 'Дата народження',
      fieldLabel: 'Дата народження',
      initialValue: snap.birthDate ?? '',
      mode: 'date'
    }).subscribe((v) => {
      if (v !== undefined) this.profileService.patchProfile({ birthDate: v.trim() });
    });
  }

  openGender(): void {
    const snap = this.profileService.getProfileSnapshot();
    this.openFieldDialog({
      title: 'Стать',
      fieldLabel: 'Стать',
      initialValue: snap.gender ?? '',
      mode: 'gender'
    }).subscribe((v) => {
      if (v !== undefined) this.profileService.patchProfile({ gender: v.trim() });
    });
  }

  openPhone(): void {
    const snap = this.profileService.getProfileSnapshot();
    this.openFieldDialog({
      title: 'Телефон',
      fieldLabel: 'Номер телефону',
      initialValue: snap.phone ?? '',
      mode: 'tel'
    }).subscribe((v) => {
      if (v !== undefined) this.profileService.patchProfile({ phone: v.trim() });
    });
  }

  openEmail(): void {
    const snap = this.profileService.getProfileSnapshot();
    this.openFieldDialog({
      title: 'Електронна пошта',
      fieldLabel: 'Email',
      initialValue: snap.email ?? '',
      mode: 'email'
    }).subscribe((v) => {
      if (v !== undefined) this.profileService.patchProfile({ email: v.trim() });
    });
  }

  private openFieldDialog(data: EditProfileFieldDialogData) {
    const ref = this.dialog.open(EditProfileFieldDialog, {
      width: '360px',
      panelClass: 'edit-profile-dialog-panel',
      data
    });
    return ref.afterClosed();
  }
}
