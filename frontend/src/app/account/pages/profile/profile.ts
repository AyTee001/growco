import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface AccountCard {
  title: string;
  description: string;
  actionText: string;
  route: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfilePage {
  user = {
    fullName: "Ім'я та прізвище",
    phone: '+380 (XX) XXX XX XX'
  };

  cards: AccountCard[] = [
    {
      title: 'Мої замовлення',
      description:
        'Оце так 🙂\nЖодної покупочки онлайн в «Grovco».\nСпробуйте, маємо для вас круті пропозиції!',
      actionText: 'Замовити',
      route: '/product-catalog'
    },
    {
      title: 'Чеки',
      description:
        'Отакої, тут порожньо 🙂\nЩоб мати змогу переглядати чеки, щоразу скануйте QR Вашого Рахунку на касі.',
      actionText: '',
      route: ''
    },
    {
      title: 'Мої адреси',
      description:
        '🏡 Додайте свою першу адресу, щоб ми знали, куди відвезти ваше замовлення.',
      actionText: 'Додати адресу',
      route: '/account/addresses'
    }
  ];
}