package net.erstschlag.playground.user.client;

public class SearchByNameRequest {

    private String search;
    private PageableRequest pageableRequest;

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public PageableRequest getPageableRequest() {
        return pageableRequest;
    }

    public void setPageableRequest(PageableRequest pageableRequest) {
        this.pageableRequest = pageableRequest;
    }

}
