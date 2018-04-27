import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

    private handlers: { [key: string]: DetachedRouteHandle } = {};

    private preservedUrls = [
        // /seeAllData/,
        /addHereUrlThatShoulNotBeSaved/
    ];

    constructor() {
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }
    store(route: ActivatedRouteSnapshot, handle: {}): void {
        this.handlers[route.url.join('/') || route.parent.url.join('/')] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const url = route.url.join('/') || route.parent.url.join('/');
        for (const preservedUrl of this.preservedUrls) {
            if (preservedUrl.test(url)) {
                return false;
            }
        }
        return !!this.handlers[url];
    }

    retrieve(route: ActivatedRouteSnapshot): {} {
        return this.handlers[route.url.join('/') || route.parent.url.join('/')];
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}
