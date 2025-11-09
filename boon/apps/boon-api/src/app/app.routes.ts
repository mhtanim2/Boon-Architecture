import { AdminModule } from './features/admin/admin.module';
import { ArticoliModule } from './features/articoli/articoli.module';
import { StatiArticoliModule } from './features/articoli/stati-articoli/stati-articoli.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersAuthModule } from './features/auth/users/users.module';
import { ClientiModule } from './features/clienti/clienti.module';
import { FileUploadsModule } from './features/file-uploads/file-uploads.module';
import { GeneriModule } from './features/generi/generi.module';
import { LivelliPrivilegioModule } from './features/livelli-privilegio/livelli-privilegio.module';
import { RevisioniModule } from './features/revisioni/revisioni.module';
import { StatiRevisioniModule } from './features/revisioni/stati-revisioni/stati-revisioni.module';
import { RuoliModule } from './features/ruoli/ruoli.module';
import { StagioniClientiModule } from './features/stagioni-clienti/stagioni-clienti.module';
import { StagioniModule } from './features/stagioni/stagioni.module';
import { StorageModule } from './features/storage/storage.module';
import { StatiTemplateModule } from './features/template/stati-template/stati-template.module';
import { TemplateModule } from './features/template/template.module';
import { TenantsFeaturesModule } from './features/tenants/tenants-features/tenants-features.module';
import { TenantsPrivilegesModule } from './features/tenants/tenants-privileges/tenants-privileges.module';
import { TenantsRolesModule } from './features/tenants/tenants-roles/tenants-roles.module';
import { TenantsModule } from './features/tenants/tenants.module';
import { StatiAccountsModule } from './features/users/stati-accounts/stati-accounts.module';
import { UsersModule } from './features/users/users.module';

export const appRoutes = [
  {
    path: 'admin',
    module: AdminModule,
    children: [
      {
        path: 'clienti',
        module: ClientiModule,
        children: [],
      },
      {
        path: 'articoli',
        children: [
          {
            path: 'stati-articoli',
            module: StatiArticoliModule,
            children: [],
          },
        ],
      },
      {
        path: 'generi',
        module: GeneriModule,
        children: [],
      },
      {
        path: 'privilegi',
        children: [
          {
            path: 'livelli',
            module: LivelliPrivilegioModule,
            children: [],
          },
          {
            path: 'ruoli',
            module: RuoliModule,
            children: [],
          },
        ],
      },
      {
        path: 'revisioni',
        module: RevisioniModule,
        children: [
          {
            path: 'stati-revisioni',
            module: StatiRevisioniModule,
            children: [],
          },
        ],
      },
      {
        path: 'stagioni',
        module: StagioniModule,
      },
      {
        path: 'template',
        children: [
          {
            path: 'stati-template',
            module: StatiTemplateModule,
            children: [],
          },
        ],
      },
      {
        path: 'users',
        module: UsersModule,
        children: [
          {
            path: 'stati-accounts',
            module: StatiAccountsModule,
            children: [],
          },
        ],
      },
    ],
  },
  {
    path: 'storage',
    module: StorageModule,
  },
  {
    path: ':tenant',
    module: TenantsModule,
    children: [
      {
        path: 'features',
        module: TenantsFeaturesModule,
        children: [],
      },
      {
        path: 'roles',
        module: TenantsRolesModule,
        children: [],
      },
      {
        path: 'privileges',
        module: TenantsPrivilegesModule,
        children: [],
      },
      {
        path: 'articoli',
        module: ArticoliModule,
        children: [],
      },
      {
        path: 'file-uploads',
        module: FileUploadsModule,
        children: [],
      },
      {
        path: 'stagioni',
        module: StagioniClientiModule,
        children: [],
      },
      {
        path: 'revisioni',
        module: RevisioniModule,
        children: [],
      },
      {
        path: 'template',
        module: TemplateModule,
        children: [],
      },
    ],
  },
  {
    path: 'auth',
    module: AuthModule,
    children: [
      {
        path: 'users',
        module: UsersAuthModule,
        children: [],
      },
    ],
  },
];
