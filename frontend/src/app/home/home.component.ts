import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[800px] bg-white">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="assets/images/doctor-hero.png" alt="Doctor" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/50"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 pt-16">
        <div class="container mx-auto px-4">
          <div class="max-w-xl">
            <p class="text-[#00A3FF] font-medium mb-2">CARING FOR LIFE</p>
            <h1 class="text-4xl md:text-5xl font-bold text-[#1e2756] mb-6">
              Leading the Way<br />
              in Medical Excellence
            </h1>
            <button class="bg-[#C7D7FF] text-[#1e2756] px-8 py-3 rounded-md hover:bg-[#B6C9FF] transition-colors" (click)="scrollToServices()">
              Our Services
            </button>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="container mx-auto px-4 mt-24">
          <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div class="bg-[#1e2756] text-white p-6 rounded-lg flex items-center gap-4">
              <div class="p-2 bg-white/10 rounded-full">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold">10K+ Patients</div>
              </div>
            </div>
            <div class="bg-[#1e2756] text-white p-6 rounded-lg flex items-center gap-4">
              <div class="p-2 bg-white/10 rounded-full">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold">500+ Doctors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-[#00A3FF] font-medium mb-2">WELCOME TO MEDICAL</h2>
        <h3 class="text-3xl font-bold text-[#1e2756] mb-6">A Great Place to Receive Care</h3>
        <p class="max-w-3xl mx-auto text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Convallis felis vitae tortor augue. Velit nascetur proin massa in.
          Consequat faucibus porttitor enim et.
        </p>
        <div class="mt-12">
          <img src="assets/images/medical-team.png" alt="Medical Team" class="w-full max-w-4xl mx-auto rounded-lg shadow-lg">
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <p class="text-[#00A3FF] font-medium mb-2">CARE YOU CAN BELIEVE IN</p>
          <h2 class="text-4xl font-bold text-[#1e2756]">Our Services</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Left Content -->
          <div>
            <h3 class="text-2xl font-bold text-[#1e2756] mb-8">A passion for putting patients first.</h3>

            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#00A3FF]"></div>
                <span class="text-lg">A Passion for Healing</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#00A3FF]"></div>
                <span class="text-lg">All our best</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#00A3FF]"></div>
                <span class="text-lg">A Legacy of Excellence</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#00A3FF]"></div>
                <span class="text-lg">5-Star Care</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#00A3FF]"></div>
                <span class="text-lg">Believe in Us</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#00A3FF]"></div>
                <span class="text-lg">Always Caring</span>
              </div>
            </div>

            <p class="mt-8 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque
              placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in.
              Consequat faucibus porttitor enim et.
            </p>
            <p class="mt-4 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque. Convallis felis vitae tortor
              augue. Velit nascetur proin massa in.
            </p>
          </div>

          <!-- Right Images -->
          <div class="space-y-6">
            <img src="assets/images/doctor-patient.png" alt="Doctor with Patient" class="w-full max-w-md mx-auto rounded-lg shadow-lg">
            <img src="assets/images/medical-team.png" alt="Medical Team" class="w-full max-w-md mx-auto rounded-lg shadow-lg">
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-[#00A3FF] font-medium mb-2">BETTER INFORMATION, BETTER HEALTH</h2>
          <h3 class="text-3xl font-bold text-[#1e2756]">News</h3>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="assets/images/news-image.png" alt="News 1" class="w-full h-48 object-cover">
            <div class="p-6">
              <p class="text-sm text-gray-500 mb-2">Monday 05, September 2021</p>
              <h4 class="text-xl font-bold text-[#1e2756] mb-2">This Article's Title goes Here</h4>
              <p class="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque.</p>
              <div class="flex items-center gap-4">
                <button class="text-[#00A3FF]">Read More</button>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-500">68</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="assets/images/news-image.png" alt="News 2" class="w-full h-48 object-cover">
            <div class="p-6">
              <p class="text-sm text-gray-500 mb-2">Monday 05, September 2021</p>
              <h4 class="text-xl font-bold text-[#1e2756] mb-2">This Article's Title goes Here</h4>
              <p class="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque.</p>
              <div class="flex items-center gap-4">
                <button class="text-[#00A3FF]">Read More</button>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-500">68</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564658896!5m2!1sen!2s"
          width="100%"
          height="450"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          class="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-[#00A3FF] font-medium mb-2">GET IN TOUCH</h2>
          <h3 class="text-3xl font-bold text-[#1e2756]">Contact</h3>
        </div>

        <div class="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-[#E8F3FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="font-bold text-[#1e2756] mb-2">EMERGENCY</h4>
            <p class="text-gray-600">(+212) 681-812-255</p>
            <p class="text-gray-600">(+212) 666-331-894</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-[#E8F3FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h4 class="font-bold text-[#1e2756] mb-2">LOCATION</h4>
            <p class="text-gray-600">0123 Some place</p>
            <p class="text-gray-600">Some country</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-[#E8F3FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="font-bold text-[#1e2756] mb-2">EMAIL</h4>
            <p class="text-gray-600">carelink&#64;gmail.com</p>
            <p class="text-gray-600">info&#64;carelink.com</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-[#E8F3FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="font-bold text-[#1e2756] mb-2">WORKING HOURS</h4>
            <p class="text-gray-600">Mon-Sat 09:00-20:00</p>
            <p class="text-gray-600">Sunday Emergency only</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
