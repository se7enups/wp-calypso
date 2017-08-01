# Data Layer freshness verifier

## Background

Calypso components are allowed to dispatch request actions that specify their data needs (most of the times using query components). Normally the components don't need a request to be issued they just need data that is "fresh".

When a component has a data need it dispatches a request action. This leaves a problem when the component is mounted, unmounted and mounted again 2 requests are executed even if the last one was executed seconds ago. This behavior could be observable in comments, if a user shows, hide, shows the comments of a post 2 requests are generated. This happens in other cases and there are unnecessary request being dispatched, possibly wasting data-usage, battery and CPU parsing the requests.

Sometimes components need that data is maintained fresh while they are being used and not just on render. We have an [interval component](https://github.com/Automattic/wp-calypso/tree/master/client/lib/interval) that provides a way for components to specify their need to periodically execute some function. Components with a need a have data refresh could use interval component to dispatch a request action. But if there are 2 components with the same data-need two requests would be dispatched. If there existed a mechanism that just ignored requests that are still fresh that would not be a problem.


## Goals and characteristics

The goal of freshness verifier is to provide a way for data-layer users/handlers to specify that a given request should be ignored if an equal request was executed recently.
Data-layer should provide a default amount of time for the request be considered fresh, but there are situations where we require data to be more recent than in other uses of the same data, so the requester should also be able to configure the freshness value.

## API
The handler when using dispatchRequest needs to pass in the options object a freshness property, that represents the default maximum amount of time passed since last execution for the request be considered fresh (and ignored).
e.g:
```js
[ COMMENTS_REQUEST ]: [ dispatchRequest( fetchPostComments, addComments, announceFailure, noop, { freshness: 10000 } ) ],
```
The freshness value the data-layer sets acts as a default value if a data requester has a particular need for a different freshness value it can pass that value in the action being dispatched:
```js
{
 type: COMMENTS_REQUEST,
 siteId: 12886750,
 postId: 97,
 ...
 freshness: 2000
}
```

When a request is still fresh it does not trigger a network request and is ignored.

## Implementation

This dispatchRequest function wraps initiator and onSuccess parameter functions to perform the freshness verification needs.
```js
export const dispatchRequest = ( initiator, onSuccess, onError, onProgress = noop, options ) => {
  ...
  initiator = initiatorWithFreshness( initiator, freshness ); // identity function if no freshness specified
  onSuccess = onSuccessWithFreshness( onSuccess, freshness );
  ...
}
```

The initiator wrapper compares the last successful execution time with current time and if it is less than the freshness value it does nothing and ignores the action if it is not less it calls the normal initiator.
```js
export const initiatorWithFreshness = ( initiator, freshness ) => ( store, action, next ) => {
	if( freshness || action.freshness ){
		const lastUpdate = history.get( buildActionKey( action ) ) || -Infinity;
		const now = Date.now();
	
		const staleness = now - lastUpdate;
	
		// our data is fresher than we need it to be
		// so just skip this fetch and discard the action
		if ( staleness <= freshness ) {
			ignoreAction();
			return;
		}
	}
	return initiator( store, action, next );
};
```

The onSuccess wrapper updates the time of the last successful execution and calls the original onSuccess function.
```js
export const onSuccessWithFreshness = ( onSuccess, freshness ) => ( store, action, next, data ) => {
	if( freshness || action.freshness ){
		history.set( buildActionKey( action ), Date.now() );
	}
	return onSuccess( store, action, next, data );
};