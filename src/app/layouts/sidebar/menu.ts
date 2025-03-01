import { MenuItem } from './menu.model';
export const MENU: MenuItem[] = [
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/epage/dashboard',
                parentId: 2
            },
       ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 9,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx-calendar',
        link: '/epage/calendar',
    },
    {
        id: 100,
        label: 'CUSTOMERS',
        icon: 'bx-body',
        subItems: [
            {
                id: 101,
                label: 'ADD CUSTOMER',
                link: 'catalog/customer',
                parentId: 100
            }
        ]
    },
    {
        id: 200,
        label: 'RESTAURANT',
        icon: 'bx-restaurant',
        subItems: [
            {
                id: 201,
                label: 'MENU',
                link: 'restaurant/menu',
                parentId: 200
            },
            {
                id: 202,
                label: 'MENU CATEGORY',
                link: 'restaurant/menucategory',
                parentId: 200
            },
            {
                id: 203,
                label: 'SELL',
                link: 'restaurant/sell',
                parentId: 200
            },
            {
                id: 204,
                label: 'ORDER HISTORY',
                link: 'restaurant/orderhistory',
                parentId: 200
            }
        ]
    },
  
    {
        id: 500,
        label: 'ROOM MANAGEMENT',
        icon: 'bx-border-all',
        subItems: [
            {
                id: 501,
                label: 'ADD ROOM',
                link: 'room/newroom',
                parentId: 500
            },
            {
                id: 502,
                label: 'ADD AMENITY',
                link: 'room/roomamenity',
                parentId: 500
            },
            {
                id: 502,
                label: 'ROOM CATEGORY',
                link: 'room/roomcategory',
                parentId: 500
            },
 
        ]
    },
    {
        id: 700,
        label: 'PACKAGE MANAGEMENT',
        icon: 'bx-store',
        subItems: [
            {
                id: 701,
                label: 'ADD PACKAGE',
                link: 'package/newpackage',
                parentId: 700
            },
            {
                id: 702,
                label: 'ADD AMENITY',
                link: 'package/amenity',
                parentId: 700
            },
                  
        ]
    },

    {
        id: 600,
        label: 'BOOKING',
        icon: 'bx-cart',
        subItems: [
            {
                id: 601,
                label: 'ROOMS',
                link: 'room/booking',
                parentId: 600
            },
            {
                id: 602,
                label: 'PACKAGE',
                link: 'package/booking',
                parentId: 600
            },

            
        ]
    },
    {
        id: 800,
        label: 'REPORT',
        icon: 'bxs-report',
        subItems: [
            {
                id: 801,
                label: 'Detail Report',
                link: 'report/detailreport',
                parentId: 800
            },
            
            
        ]
    },
    {
        id: 900,
        label: 'ADMINISTRATION',
        icon: 'bxs-buoy',
        subItems: [
            {
                id: 901,
                label: 'Role',
                link: 'admin/role',
                parentId: 900
            },
            {
                id: 902,
                label: 'User',
                link: 'admin/user',
                parentId: 900
            },
            {
                id: 903,
                label: 'Setup',
                link: 'admin/setup',
                parentId: 900
            },
            {
                id: 904,
                label: 'Chain',
                link: 'admin/chain',
                parentId: 900
            },
            
            
        ]
    },

];
export const MENUReceptionist: MenuItem[] = [
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/epage/dashboard',
                parentId: 2
            },
       ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 9,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx-calendar',
        link: '/epage/calendar',
    },
    
  
    
    

    {
        id: 600,
        label: 'BOOKING',
        icon: 'bx-cart',
        subItems: [
            {
                id: 601,
                label: 'ROOMS',
                link: 'room/booking',
                parentId: 600
            },
            {
                id: 602,
                label: 'PACKAGE',
                link: 'package/booking',
                parentId: 600
            },

            
        ]
    },
    {
        id: 800,
        label: 'REPORT',
        icon: 'bxs-report',
        subItems: [
            {
                id: 801,
                label: 'Detail Report',
                link: 'report/detailreport',
                parentId: 800
            },
            
            
        ]
    },
    
];
export const MENUPOS: MenuItem[] = [
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/epage/dashboard',
                parentId: 2
            },
       ]
    },
    {
        id: 200,
        label: 'RESTAURANT',
        icon: 'bx-restaurant',
        subItems: [
            {
                id: 203,
                label: 'SELL',
                link: 'restaurant/sell',
                parentId: 200
            },
            {
                id: 204,
                label: 'ORDER HISTORY',
                link: 'restaurant/orderhistory',
                parentId: 200
            }
        ]
    },
    {
        id: 7,
        isLayout: true
    },
    
    
];
export const MENUManager: MenuItem[] = [
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/epage/dashboard',
                parentId: 2
            },
       ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 9,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx-calendar',
        link: '/epage/calendar',
    },
    {
        id: 100,
        label: 'CUSTOMERS',
        icon: 'bx-body',
        subItems: [
            {
                id: 101,
                label: 'ADD CUSTOMER',
                link: 'catalog/customer',
                parentId: 100
            }
        ]
    },
    {
        id: 200,
        label: 'RESTAURANT',
        icon: 'bx-restaurant',
        subItems: [
            {
                id: 201,
                label: 'MENU',
                link: 'restaurant/menu',
                parentId: 200
            },
            {
                id: 202,
                label: 'MENU CATEGORY',
                link: 'restaurant/menucategory',
                parentId: 200
            },
            {
                id: 203,
                label: 'SELL',
                link: 'restaurant/sell',
                parentId: 200
            },
            {
                id: 204,
                label: 'ORDER HISTORY',
                link: 'restaurant/orderhistory',
                parentId: 200
            }
        ]
    },
  
    {
        id: 500,
        label: 'ROOM MANAGEMENT',
        icon: 'bx-border-all',
        subItems: [
            {
                id: 501,
                label: 'ADD ROOM',
                link: 'room/newroom',
                parentId: 500
            },
            {
                id: 502,
                label: 'ADD AMENITY',
                link: 'room/roomamenity',
                parentId: 500
            },
            {
                id: 502,
                label: 'ROOM CATEGORY',
                link: 'room/roomcategory',
                parentId: 500
            },
 
        ]
    },
    {
        id: 700,
        label: 'PACKAGE MANAGEMENT',
        icon: 'bx-store',
        subItems: [
            {
                id: 701,
                label: 'ADD PACKAGE',
                link: 'package/newpackage',
                parentId: 700
            },
            {
                id: 702,
                label: 'ADD AMENITY',
                link: 'package/amenity',
                parentId: 700
            },
                  
        ]
    },

    {
        id: 600,
        label: 'BOOKING',
        icon: 'bx-cart',
        subItems: [
            {
                id: 601,
                label: 'ROOMS',
                link: 'room/booking',
                parentId: 600
            },
            {
                id: 602,
                label: 'PACKAGE',
                link: 'package/booking',
                parentId: 600
            },

            
        ]
    },
    {
        id: 800,
        label: 'REPORT',
        icon: 'bxs-report',
        subItems: [
            {
                id: 801,
                label: 'Detail Report',
                link: 'report/detailreport',
                parentId: 800
            },
            
            
        ]
    },
    {
        id: 900,
        label: 'ADMINISTRATION',
        icon: 'bxs-buoy',
        subItems: [
            
            {
                id: 902,
                label: 'User',
                link: 'admin/user',
                parentId: 900
            },
        ]
    },

];

